import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ExtendedRequest } from '../middlewares/upload.middleware';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const items = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener testimonios.' });
  }
};

export const createTestimonial = async (req: ExtendedRequest & AuthenticatedRequest, res: Response) => {
  try {
    const { authorName, authorRole, company, quote, rating } = req.body;
    const avatarWebp = req.fileWebpUrl || '/assets/defaults/avatar-default.webp';

    const item = await prisma.testimonial.create({
      data: {
        authorName,
        authorRole,
        company,
        quote,
        rating: rating ? parseInt(rating, 10) : 5,
        avatarWebp
      }
    });

    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al crear testimonio.' });
  }
};

export const deleteTestimonial = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.update({ where: { id }, data: { isActive: false } });
    return res.json({ success: true, message: 'Testimonio eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al eliminar testimonio.' });
  }
};
