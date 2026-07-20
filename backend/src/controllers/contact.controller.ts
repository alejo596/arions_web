import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendContactEmail } from '../services/email.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { logAuditAction } from '../services/audit.service';
import { ContactStatus } from '@prisma/client';

export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Nombre, email, asunto y mensaje son obligatorios.' });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        company: company || null,
        email,
        phone: phone || null,
        subject,
        message,
        status: ContactStatus.PENDING
      }
    });

    // Send email asynchronously via SMTP
    sendContactEmail({ name, email, company, phone, subject, message }).catch(err => {
      console.error('Error enviando correo SMTP:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Mensaje enviado correctamente. Nos pondremos en contacto a la brevedad.',
      data: { id: contact.id }
    });
  } catch (error) {
    console.error('createContact error:', error);
    return res.status(500).json({ success: false, message: 'Error al enviar el mensaje de contacto.' });
  }
};

export const getContactsAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', status, search = '' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      OR: [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { subject: { contains: search as string, mode: 'insensitive' } }
      ]
    };

    if (status && Object.values(ContactStatus).includes(status as ContactStatus)) {
      where.status = status as ContactStatus;
    }

    const [items, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contact.count({ where })
    ]);

    return res.json({
      success: true,
      data: items,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener mensajes de contacto.' });
  }
};

export const updateContactStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, replyNotes } = req.body;

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        status: status as ContactStatus,
        replyNotes: replyNotes || undefined
      }
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'UPDATE_CONTACT_STATUS',
      entity: 'Contact',
      entityId: id,
      ipAddress: req.ip
    });

    return res.json({ success: true, data: contact });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al actualizar estado del contacto.' });
  }
};
