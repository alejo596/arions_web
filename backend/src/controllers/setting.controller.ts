import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ExtendedRequest } from '../middlewares/upload.middleware';
import { logAuditAction } from '../services/audit.service';

export const getSiteSettings = async (req: Request, res: Response) => {
  try {
    let setting = await prisma.siteSetting.findFirst();
    if (!setting) {
      setting = await prisma.siteSetting.create({
        data: {
          companyName: 'Arions Builds AI SpA',
          slogan: 'Innovación Tecnológica, Inteligencia Artificial & Construcción',
          logoWebp: '/logo.png',
          contactEmail: 'contacto@arions.tech',
          contactPhone: '+56 9 1234 5678',
          address: 'Av. Providencia 1234, Oficina 501, Santiago, Chile'
        }
      });
    }
    return res.json({ success: true, data: setting });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener configuración del sitio.' });
  }
};

export const updateSiteSettings = async (req: ExtendedRequest & AuthenticatedRequest, res: Response) => {
  try {
    let setting = await prisma.siteSetting.findFirst();
    const {
      companyName,
      slogan,
      contactEmail,
      contactPhone,
      address,
      socialLinks,
      primaryColor,
      secondaryColor
    } = req.body;

    const data: any = {};
    if (companyName) data.companyName = companyName;
    if (slogan) data.slogan = slogan;
    if (contactEmail) data.contactEmail = contactEmail;
    if (contactPhone) data.contactPhone = contactPhone;
    if (address) data.address = address;
    if (primaryColor) data.primaryColor = primaryColor;
    if (secondaryColor) data.secondaryColor = secondaryColor;
    if (socialLinks) data.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
    if (req.fileWebpUrl) data.logoWebp = req.fileWebpUrl;

    if (setting) {
      setting = await prisma.siteSetting.update({
        where: { id: setting.id },
        data
      });
    } else {
      setting = await prisma.siteSetting.create({ data });
    }

    await logAuditAction({
      userId: req.user?.userId,
      action: 'UPDATE_SETTINGS',
      entity: 'SiteSetting',
      entityId: setting.id,
      ipAddress: req.ip
    });

    return res.json({ success: true, data: setting });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al actualizar configuración del sitio.' });
  }
};
