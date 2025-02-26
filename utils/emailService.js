import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailServices = {
  gmail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
  yahoo: {
    host: "smtp.mail.yahoo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
  // Add other email services as needed
};

const selectedService = emailServices[process.env.EMAIL_SERVICE];

if (!selectedService) {
  throw new Error(`Unsupported email service: ${process.env.EMAIL_SERVICE}`);
}

const transporter = nodemailer.createTransport(selectedService);

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 */
export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Mall Prod" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);
  }
};
