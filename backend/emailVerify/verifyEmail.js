import nodemailer from "nodemailer";
import "dotenv/config";

// Initialize the transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

export const verifyEmail = async (token, email) => {
  console.log("Sending Verification to:", email);

  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;

    await transporter.verify();

console.log("SMTP Ready");

    const info = await transporter.sendMail({
      from: `"E-Kart" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Verify Your E-Kart Account",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #333;">Welcome to E-Kart 🎉</h2>
          <p style="color: #555;">Thank you for registering. Please click the button below to verify your email address:</p>
          
          <div style="margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Verify Email
            </a>
          </div>

          <p style="color: #555; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #7c3aed; font-size: 14px; word-break: break-all;">${verificationLink}</p>
          
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px;">If you did not create this account, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ Verification Email Sent Successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email Sending Error:", error);
    throw error;
  }
};