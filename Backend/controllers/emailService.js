// emailService.js
const nodemailer = require("nodemailer");

const sendResetEmail = async (toEmail, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // use gmail
    auth: {
      user: 'pratikshapawar920@gmail.com', // your gmail
      pass: 'Pr@tiksh@658',     // your Gmail app password (NOT your real Gmail password!)
    },
  });

  const mailOptions = {
    from: '"Store Rating App" <pratikshapawar920@gmail.com>',
    to: toEmail,
    subject: 'Password Reset Link',
    html: `
      <h3>Hello!</h3>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
