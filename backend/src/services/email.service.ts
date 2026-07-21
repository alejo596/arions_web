import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_PORT === 465,
  auth: config.SMTP_USER ? {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS
  } : undefined
});

export const sendContactEmail = async (contactData: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
}) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 8px;">
      <h2 style="color: #3b82f6; border-bottom: 2px solid #1e293b; padding-bottom: 8px;">Nuevo Mensaje de Contacto - ARIONS</h2>
      <p><strong>Nombre:</strong> ${contactData.name}</p>
      <p><strong>Correo:</strong> ${contactData.email}</p>
      <p><strong>Empresa:</strong> ${contactData.company || 'N/A'}</p>
      <p><strong>Teléfono:</strong> ${contactData.phone || 'N/A'}</p>
      <p><strong>Asunto:</strong> ${contactData.subject}</p>
      <div style="background-color: #1e293b; padding: 16px; border-radius: 6px; margin-top: 12px;">
        <p style="white-space: pre-wrap; margin: 0;">${contactData.message}</p>
      </div>
    </div>
  `;

  if (!config.SMTP_USER) {
    console.log('[Email Simulation] SMTP no configurado. Mensaje capturado:', contactData.subject);
    return true;
  }

  return transporter.sendMail({
    from: config.SMTP_FROM,
    to: config.CONTACT_EMAIL || 'contacto@arions.tech',
    subject: `[Contacto ARIONS] ${contactData.subject}`,
    html: htmlContent
  });
};
