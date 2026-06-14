import { Resend } from "resend";
import "dotenv/config";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmail = async (token, email) => {
  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;

    const { data, error } = await resend.emails.send({
      from: "E-Kart <onboarding@resend.dev>", // See note below about domains
      to: email,
      subject: "Verify Your E-Kart Account",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to E-Kart 🎉</h2>
          <p>Thank you for registering with E-Kart.</p>
          <p>Please click the button below to verify your email address:</p>

          <a
            href="${verificationLink}"
            style="
              display:inline-block;
              padding:12px 24px;
              background:#7c3aed;
              color:white;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
            "
          >
            Verify Email
          </a>

          <p style="margin-top:20px;">
            Or copy and paste this link into your browser:
          </p>

          <p>${verificationLink}</p>

          <p>If you did not create this account, you can safely ignore this email.</p>

          <br/>
          <p>Regards,</p>
          <p><strong>E-Kart Team</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      throw error;
    }

    console.log("✅ Email Sent Successfully via Resend:", data);
    return true;
  } catch (error) {
    console.error("❌ Email Sending Error:", error);
    throw error;
  }
};