import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOtpMail = async (otp, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is <b>${otp}</b></p>`,
    };

    const info = await transporter.sendMail(mailConfigurations);

    console.log("OTP Sent Successfully");
    console.log(info.response);

    return true;
  } catch (error) {
    console.error("Email Error:", error);
    return false;
  }
};