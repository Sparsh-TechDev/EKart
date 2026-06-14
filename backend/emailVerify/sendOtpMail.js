import nodemailer from "nodemailer";

import "dotenv/config";

export const sendOtpMail = async (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailConfigurations = {
    // It should be a string of sender/server email
    from: process.env.MAIL_USER,

    to: email,

    // Subject of Email
    subject: "Password Reset OPT",

    // This would be the text of email body
    // text: `Hi! There, You have recently visited 
    //        our website and entered your email.
    //        Please follow the given link to verify your email
    //        http://localhost:5173/verify/${token} 
    //        Thanks`,
    html: `<p>Your OTP for password reset is <b>${otp}</b></p>`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log("OTP Sent Successfully");
    console.log(info);
  });
};
