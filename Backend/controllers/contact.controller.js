import Contact from "../models/contact.model.js";
import mongoose from "mongoose";
import { sendAdminReplyEmail } from "../services/mail.service.js";

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

    return res.status(201).json({
      success: true,
      message: "Message saved successfully. We will reach out to you in 24-48 hours.",
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

// Update contact status
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'In Progress', 'Resolved', 'Spam'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: `Contact status updated to "${status}"`,
      contact: {
        id: contact._id,
        status: contact.status
      }
    });
  } catch (error) {
    console.error("updateContactStatus error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
    }

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully"
    });
  } catch (error) {
    console.error("deleteContact error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single contact by ID
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
    }

    const contact = await Contact.findById(id).lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }

    return res.status(200).json({
      success: true,
      contact
    });
  } catch (error) {
    console.error("getContactById error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reply to contact via email
export const replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage, adminName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
    }

    if (!replyMessage || replyMessage.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Reply message must be at least 10 characters"
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }

    // Send the email
    await sendAdminReplyEmail({
      name: contact.name,
      email: contact.email,
      originalSubject: contact.subject,
      originalMessage: contact.message,
      adminReply: replyMessage.trim(),
      adminName: adminName || "SevaIndia Support Team"
    });

    // Update contact status to Resolved
    contact.status = "Resolved";
    await contact.save();

    return res.status(200).json({
      success: true,
      message: `Reply sent successfully to ${contact.email}`,
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        status: contact.status
      }
    });
  } catch (error) {
    console.error("replyToContact error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send reply email"
    });
  }
};
