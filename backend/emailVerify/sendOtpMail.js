import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOtpMail = async (otp, email) => {
  console.log("Sending OTP to:", email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is <b>${otp}</b></p>`,
    });

    console.log("OTP Sent Successfully");
    console.log(info.response);
  } catch (error) {
    console.error("MAIL ERROR:", error);
  }
};