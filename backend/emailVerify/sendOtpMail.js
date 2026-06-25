import nodemailer from "nodemailer";
import "dotenv/config";

// Initialize the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, 
  },
});

export const sendOtpMail = async (otp, email) => {
  console.log("Sending OTP to:", email);

  try {
    const info = await transporter.sendMail({
      from: `"E-Kart" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #555;">You requested to reset your password for E-Kart.</p>
          <p style="color: #555;">Your One-Time Password (OTP) is:</p>
          <h1 style="color: #7c3aed; letter-spacing: 5px; background: #f4f4f5; padding: 10px; text-align: center; border-radius: 5px; width: fit-content;">
            ${otp}
          </h1>
          <p style="color: #555;">This OTP is valid for 10 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ OTP Sent Successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ MAIL ERROR:", error);
    throw error; 
  }
};