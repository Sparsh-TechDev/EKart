import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = async (token, email) => {
  try {
    console.log("MAIL_USER:", process.env.MAIL_USER);
    console.log("MAIL_PASS EXISTS:", !!process.env.MAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;

    const mailConfigurations = {
      from: process.env.MAIL_USER,
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
    };

    const info = await transporter.sendMail(mailConfigurations);

    console.log("✅ Email Sent Successfully");
    console.log(info.response);

    return true;
  } catch (error) {
    console.error("❌ Email Sending Error:", error);
    throw error;
  }
};