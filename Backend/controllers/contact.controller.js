import Contact from "../models/contact.model.js";
import mongoose from "mongoose";
import { sendContactAcknowledgementEmail } from "../services/mail.service.js";

const toBool = (value) => value === true || value === "true" || value === "on";

export const createContact = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected"
      });
    }

    const { name, email, subject, message, privacy, privacyAccepted } = req.body;
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanSubject = String(subject || "").trim();
    const cleanMessage = String(message || "").trim();
    const isPrivacyAccepted = toBool(privacyAccepted ?? privacy);

    if (!cleanName || !cleanEmail || !cleanSubject || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!isPrivacyAccepted) {
      return res.status(400).json({
        success: false,
        message: "You must agree to the privacy policy"
      });
    }

    const contact = await Contact.create({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      privacyAccepted: true
    });

    // Send acknowledgement email in background so API response is not blocked by SMTP latency.
    setImmediate(async () => {
      try {
        await sendContactAcknowledgementEmail({
          name: contact.name,
          email: contact.email,
          subject: contact.subject
        });
      } catch (mailError) {
        console.error("Contact acknowledgement email error:", mailError.message);
      }
    });

    return res.status(201).json({
      success: true,
      message: "Message saved successfully. We will reach out to you in 24-48 hours.",
      emailQueued: true,
      contactId: contact._id,
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    const status = error.name === "ValidationError" ? 400 : 500;
    console.error("createContact error:", error);
    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected"
      });
    }

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
