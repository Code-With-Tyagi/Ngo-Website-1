import nodemailer from "nodemailer";
import "../config/loadEnv.js";

// 1. Configuration Check
const getEmailConfig = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

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
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
    auth: {
      user,
      pass
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

// 4. Main Email Function
export const sendContactAcknowledgementEmail = async ({ name, email, subject }) => {
  const { user } = getEmailConfig();
  const mailer = getTransporter();

  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject);

  // Modern HTML Design for SevaIndia
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* Mobile Responsive Styles */
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; padding: 20px !important; }
          .content { padding: 20px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #fff7ed; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff7ed; padding: 40px 0;">
        <tr>
          <td align="center">
            
            <table role="presentation" class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;">
              
              <tr>
                <td style="background-color: #ea580c; padding: 5px;"></td>
              </tr>

              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #c2410c; font-size: 26px; font-weight: 700;">SevaIndia</h1>
                  <p style="margin: 5px 0 0 0; color: #78716c; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Service to Humanity</p>
                </td>
              </tr>

              <tr>
                <td class="content" style="padding: 0 40px 40px 40px;">
                  <p style="color: #44403c; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    Namaste <strong>${safeName}</strong>,
                  </p>
                  
                  <p style="color: #44403c; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    Thank you for connecting with <strong>SevaIndia</strong>. We have received your message and appreciate you reaching out to us.
                  </p>

                  <div style="background-color: #ffedd5; border-left: 4px solid #ea580c; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
                    <p style="margin: 0; color: #9a3412; font-size: 14px; font-weight: 600;">
                      We will get back to you in:
                    </p>
                    <p style="margin: 5px 0 0 0; color: #c2410c; font-size: 18px; font-weight: 700;">
                      24 - 48 Hours
                    </p>
                  </div>

                  <p style="color: #78716c; font-size: 14px; margin-bottom: 5px;">
                    Subject of your query:
                  </p>
                  <p style="color: #1c1917; font-size: 15px; font-weight: 500; font-style: italic; margin-top: 0;">
                    "${safeSubject}"
                  </p>

                  <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 30px 0;">

                  <p style="color: #a8a29e; font-size: 14px; text-align: center; margin: 0;">
                    Warm Regards,<br>
                    <strong>The SevaIndia Team</strong>
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="background-color: #f5f5f4; padding: 20px; text-align: center;">
                  <p style="margin: 0; color: #a8a29e; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} SevaIndia. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

  // Standard Text Version (for old devices)
  const textTemplate = [
    `Namaste ${name},`,
    "",
    "Thank you for reaching out to SevaIndia.",
    "We have received your message regarding: " + subject,
    "",
    "Our team will get back to you within 24-48 hours.",
    "",
    "Warm Regards,",
    "SevaIndia Team"
  ].join("\n");

  const mailOptions = {
    from: `"SevaIndia Support" <${user}>`,
    to: email,
    subject: "Thank you for contacting SevaIndia", 
    text: textTemplate,
    html: htmlTemplate
  };

  await mailer.sendMail(mailOptions);
  console.log(`Acknowledgement email sent to ${email}`);
};

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
