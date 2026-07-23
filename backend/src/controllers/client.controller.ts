import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ExtendedRequest } from '../middlewares/upload.middleware';

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    return res.json({ success: true, data: clients });
  } catch (error) {
    console.error('getClients error:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener clientes.' });
  }
};

export const createClient = async (req: ExtendedRequest & AuthenticatedRequest, res: Response) => {
  try {
    const { name, websiteUrl, order } = req.body;
    const logoWebp = req.fileWebpUrl || '/assets/defaults/client-logo-default.webp';

    const client = await prisma.client.create({
      data: {
        name,
        logoWebp,
        websiteUrl: websiteUrl || null,
        order: order ? parseInt(order, 10) : 0
      }
    });

    return res.status(201).json({ success: true, data: client });
  } catch (error) {
    console.error('createClient error:', error);
    return res.status(500).json({ success: false, message: 'Error al crear cliente.' });
  }
};

export const updateClient = async (req: ExtendedRequest & AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, websiteUrl, order, isActive } = req.body;

    const existingClient = await prisma.client.findUnique({ where: { id } });
    if (!existingClient) {
      return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
    }

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (websiteUrl !== undefined) data.websiteUrl = websiteUrl || null;
    if (order !== undefined) data.order = parseInt(order, 10) || 0;
    if (isActive !== undefined) {
      data.isActive = isActive === 'true' || isActive === true;
    }
    if (req.fileWebpUrl) {
      data.logoWebp = req.fileWebpUrl;
    }

    const client = await prisma.client.update({
      where: { id },
      data
    });

    return res.json({ success: true, data: client });
  } catch (error) {
    console.error('updateClient error:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar cliente.' });
  }
};

export const deleteClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.client.update({ where: { id }, data: { isActive: false } });
    return res.json({ success: true, message: 'Cliente eliminado correctamente.' });
  } catch (error) {
    console.error('deleteClient error:', error);
    return res.status(500).json({ success: false, message: 'Error al eliminar cliente.' });
  }
};

