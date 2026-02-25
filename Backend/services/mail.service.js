import nodemailer from "nodemailer";
import "../config/loadEnv.js";

// 1. Configuration Check
const getEmailConfig = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();

  if (!user || !pass) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set in .env");
  }

  return { user, pass };
};

// 2. Singleton Transporter
let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  const { user, pass } = getEmailConfig();

  transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return transporter;
};

// 3. Security: Prevent HTML Injection
const escapeHtml = (text) =>
  String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Send Reset Password Email
export const sendResetPasswordEmail = async ({ name, email, resetUrl, expiryMinutes = 15 }) => {
  const { user } = getEmailConfig();
  const mailer = getTransporter();

  const safeName = escapeHtml(name || "User");
  const safeResetUrl = escapeHtml(resetUrl);

  const textTemplate = [
    `Hi ${name || "User"},`,
    "",
    "We received a request to reset your SevaIndia password.",
    "Use the Reset Password button in this email to set a new password.",
    "",
    `This link will expire in ${expiryMinutes} minutes.`,
    "If you did not request this, you can ignore this email."
  ].join("\n");

  const htmlTemplate = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:620px;margin:0 auto;padding:20px;">
      <h2 style="margin:0 0 12px;color:#2e7d32;">Reset Your Password</h2>
      <p style="margin:0 0 10px;">Hi <strong>${safeName}</strong>,</p>
      <p style="margin:0 0 16px;">We received a request to reset your SevaIndia password.</p>
      <p style="margin:0 0 20px;">
        <a href="${safeResetUrl}" style="display:inline-block;background:#2e7d32;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600;">
          Reset Password
        </a>
      </p>
      <p style="margin:0 0 6px;font-size:14px;color:#4b5563;">This link will expire in ${expiryMinutes} minutes.</p>
      <p style="margin:0;font-size:14px;color:#4b5563;">If you did not request this, you can ignore this email.</p>
    </div>
  `;

  await mailer.sendMail({
    from: `"SevaIndia Support" <${user}>`,
    to: email,
    subject: "Reset your SevaIndia password",
    text: textTemplate,
    html: htmlTemplate
  });

  console.log(`Password reset email sent to ${email}`);
};

// Send Email Verification OTP
export const sendEmailVerificationOtpEmail = async ({
  name,
  email,
  otp,
  expiryMinutes = 10
}) => {
  const { user } = getEmailConfig();
  const mailer = getTransporter();

  const safeName = escapeHtml(name || "User");
  const safeOtp = escapeHtml(otp);

  const textTemplate = [
    `Hi ${name || "User"},`,
    "",
    `Your SevaIndia email verification OTP is: ${otp}`,
    `This OTP will expire in ${expiryMinutes} minutes.`,
    "",
    "If you did not request this OTP, please ignore this email."
  ].join("\n");

  const htmlTemplate = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:620px;margin:0 auto;padding:20px;">
      <h2 style="margin:0 0 12px;color:#2e7d32;">Verify Your Email</h2>
      <p style="margin:0 0 10px;">Hi <strong>${safeName}</strong>,</p>
      <p style="margin:0 0 16px;">Use the OTP below to verify your SevaIndia email address.</p>
      <div style="margin:0 0 18px;padding:12px 16px;background:#ecfdf3;border:1px solid #bbf7d0;border-radius:10px;display:inline-block;">
        <span style="font-size:30px;letter-spacing:6px;font-weight:800;color:#166534;">${safeOtp}</span>
      </div>
      <p style="margin:0 0 6px;font-size:14px;color:#4b5563;">OTP expires in ${expiryMinutes} minutes.</p>
      <p style="margin:0;font-size:14px;color:#4b5563;">If you did not request this OTP, please ignore this email.</p>
    </div>
  `;

  await mailer.sendMail({
    from: `"SevaIndia Support" <${user}>`,
    to: email,
    subject: "Your SevaIndia email verification OTP",
    text: textTemplate,
    html: htmlTemplate
  });

  console.log(`Email verification OTP sent to ${email}`);
};

// Send Admin Reply to Contact Message
export const sendAdminReplyEmail = async ({
  name,
  email,
  originalSubject,
  originalMessage,
  adminReply,
  adminName = "SevaIndia Support Team"
}) => {
  const { user } = getEmailConfig();
  const mailer = getTransporter();

  const safeName = escapeHtml(name || "User");
  const safeSubject = escapeHtml(originalSubject);
  const safeOriginalMessage = escapeHtml(originalMessage);
  const safeAdminReply = escapeHtml(adminReply).replace(/\n/g, "<br>");
  const safeAdminName = escapeHtml(adminName);

  const textTemplate = [
    `Dear ${name || "User"},`,
    "",
    "Thank you for contacting SevaIndia. We have reviewed your message and our team has responded below.",
    "",
    "─────────────────────────────────",
    "YOUR ORIGINAL MESSAGE:",
    `Subject: ${originalSubject}`,
    "",
    originalMessage,
    "─────────────────────────────────",
    "",
    "OUR RESPONSE:",
    "",
    adminReply,
    "",
    "─────────────────────────────────",
    "",
    "If you have further questions, feel free to reply to this email or contact us again through our website.",
    "",
    "Best regards,",
    adminName,
    "SevaIndia Support Team",
    "",
    "---",
    "This is a response to your inquiry submitted via the SevaIndia Contact Form."
  ].join("\n");

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
  <div style="max-width:640px;margin:0 auto;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#ffffff;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#2e7d32 0%,#1b5e20 100%);padding:30px 40px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:0.5px;">SevaIndia</h1>
      <p style="margin:8px 0 0;color:#c8e6c9;font-size:14px;">Connecting Hearts, Transforming Lives</p>
    </div>

    <!-- Main Content -->
    <div style="padding:40px;">
      
      <!-- Greeting -->
      <p style="margin:0 0 20px;font-size:16px;color:#333333;">
        Dear <strong style="color:#2e7d32;">${safeName}</strong>,
      </p>
      
      <p style="margin:0 0 25px;font-size:15px;color:#555555;line-height:1.7;">
        Thank you for reaching out to SevaIndia. We appreciate you taking the time to contact us. 
        Our team has carefully reviewed your inquiry and we're happy to respond.
      </p>

      <!-- Original Message Box -->
      <div style="margin:0 0 25px;background:#f8f9fa;border-left:4px solid #90a4ae;border-radius:0 8px 8px 0;padding:20px;">
        <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#78909c;font-weight:600;">
          Your Original Message
        </p>
        <p style="margin:0 0 10px;font-size:14px;color:#37474f;font-weight:600;">
          Subject: ${safeSubject}
        </p>
        <p style="margin:0;font-size:14px;color:#546e7a;line-height:1.6;font-style:italic;">
          "${safeOriginalMessage}"
        </p>
      </div>

      <!-- Admin Response Box -->
      <div style="margin:0 0 30px;background:linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%);border-left:4px solid #2e7d32;border-radius:0 8px 8px 0;padding:25px;">
        <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#2e7d32;font-weight:600;">
          Our Response
        </p>
        <div style="font-size:15px;color:#1b5e20;line-height:1.8;">
          ${safeAdminReply}
        </div>
        <p style="margin:20px 0 0;font-size:13px;color:#388e3c;font-weight:500;">
          — ${safeAdminName}
        </p>
      </div>

      <!-- Call to Action -->
      <div style="text-align:center;margin:0 0 30px;padding:25px;background:#fafafa;border-radius:12px;">
        <p style="margin:0 0 15px;font-size:14px;color:#666666;">
          Have more questions? We're here to help!
        </p>
        <a href="https://sevaindia.org/contact" style="display:inline-block;background:#2e7d32;color:#ffffff;text-decoration:none;padding:12px 30px;border-radius:25px;font-weight:600;font-size:14px;">
          Contact Us Again
        </a>
      </div>

      <!-- Closing -->
      <p style="margin:0;font-size:14px;color:#666666;line-height:1.6;">
        Thank you for being a part of the SevaIndia community. Together, we can make a difference.
      </p>

    </div>

    <!-- Footer -->
    <div style="background:#263238;padding:30px 40px;text-align:center;">
      <p style="margin:0 0 10px;font-size:13px;color:#90a4ae;">
        © ${new Date().getFullYear()} SevaIndia. All rights reserved.
      </p>
      <p style="margin:0;font-size:12px;color:#78909c;">
        This email was sent in response to your inquiry on our Contact Us page.
      </p>
    </div>

  </div>
</body>
</html>
  `;

  const result = await mailer.sendMail({
    from: `"SevaIndia Support" <${user}>`,
    to: email,
    subject: `Re: ${originalSubject} - SevaIndia Support`,
    text: textTemplate,
    html: htmlTemplate,
    replyTo: user
  });

  console.log(`Admin reply email sent to ${email} - Message ID: ${result.messageId}`);
  return result;
};
