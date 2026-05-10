import nodemailer from 'nodemailer';

/**
 * Traveloop — Custom SMTP Mail Service (Nodemailer)
 * 
 * Configured using environment variables:
 * - SMTP_HOST: The SMTP server (e.g., smtp.gmail.com)
 * - SMTP_PORT: Port (e.g., 587 for TLS or 465 for SSL)
 * - SMTP_USER: Your email address
 * - SMTP_PASS: Your app-specific password
 * - SMTP_FROM: The "From" display address
 */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Traveloop" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('[Mail] Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Mail] Failed to send email:', error);
    return { success: false, error };
  }
}
