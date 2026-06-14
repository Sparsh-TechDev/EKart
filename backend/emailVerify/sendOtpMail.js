import { Resend } from "resend";
import "dotenv/config";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpMail = async (otp, email) => {
  console.log("Sending OTP to:", email);

  try {
    const { data, error } = await resend.emails.send({
      from: "E-Kart <onboarding@resend.dev>", // Must use this on the free tier
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password for E-Kart.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color: #7c3aed; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      throw error; // Let the controller know it failed!
    }

    console.log("✅ OTP Sent Successfully via Resend:", data);
    return true;
  } catch (error) {
    console.error("❌ MAIL ERROR:", error);
    throw error; 
  }
};