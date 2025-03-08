import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, qrCodeUrl: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'eventify@noreply.com',
    to: email,
    subject: 'Your Event Ticket QR Code',
    html: `
      <p>Thank you for your purchase!</p>
      <p>Below is your ticket QR Code:</p>
      <img src="${qrCodeUrl}" alt="QR Code" />
    `,
  };

  await transporter.sendMail(mailOptions);
};
