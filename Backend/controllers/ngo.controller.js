import Ngo from "../models/ngo.model.js";

const toBool = (value) => value === true || value === "true" || value === "on";

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Not JSON array, continue with CSV/single-value handling.
    }

    return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
};

const getUploadedFileName = (files, fieldName) => {
  const file = files?.[fieldName]?.[0];
  return file?.filename || "";
};

const onlyDigits = (value) => String(value || "").replace(/\D/g, "");

export const createNgo = async (req, res) => {
  try {
    const {
      ngoName,
      regType,
      regNumber,
      estYear,
      darpanId,
      panNumber,
      description,
      state,
      district,
      city,
      pincode,
      address,
      contactName,
      contactRole,
      phone,
      whatsapp,
      email,
      website,
      facebook,
      instagram,
      socialFacebook,
      socialInstagram,
      otherService,
      agreeToTerms
    } = req.body;

    const documents = {
      registrationCertificate: getUploadedFileName(req.files, "registrationCertificate"),
      ngoLogo: getUploadedFileName(req.files, "ngoLogo"),
      certificate12A: getUploadedFileName(req.files, "certificate12A"),
      certificate80G: getUploadedFileName(req.files, "certificate80G")
    };

    if (!documents.registrationCertificate) {
      return res.status(400).json({
        success: false,
        message: "Registration certificate is required"
      });
    }

    if (!documents.ngoLogo) {
      return res.status(400).json({
        success: false,
        message: "NGO logo is required"
      });
    }

    if (!toBool(agreeToTerms)) {
      return res.status(400).json({
        success: false,
        message: "You must agree to the terms"
      });
    }

    const ngo = await Ngo.create({
      ngoName,
      regType,
      regNumber,
      estYear: estYear ? Number(estYear) : undefined,
      darpanId,
      panNumber,
      description,
      state,
      district,
      city,
      pincode: pincode ? String(pincode).trim() : pincode,
      address,
      contactName,
      contactRole,
      phone: onlyDigits(phone),
      whatsapp: onlyDigits(whatsapp),
      email,
      website,
      socialMedia: {
        facebook: facebook || socialFacebook || "",
        instagram: instagram || socialInstagram || ""
      },
      services: toArray(req.body.services),
      otherService,
      documents,
      agreeToTerms: true
    });

    return res.status(201).json({
      success: true,
      message: "NGO registered successfully",
      ngo
    });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.regNumber) {
      return res.status(409).json({
        success: false,
        message: "An NGO with this registration number already exists"
      });
    }

    const status = error.name === "ValidationError" ? 400 : 500;
    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
};
