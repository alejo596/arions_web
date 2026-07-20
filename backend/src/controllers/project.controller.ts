import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ExtendedRequest } from '../middlewares/upload.middleware';
import { logAuditAction } from '../services/audit.service';
import { ProjectType, ProjectStatus } from '@prisma/client';

export const getProjectsPublic = async (req: Request, res: Response) => {
  try {
    const { type, category, status, featured, page = '1', limit = '12', search = '' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isActive: true,
      OR: [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { clientName: { contains: search as string, mode: 'insensitive' } }
      ]
    };

    if (type && Object.values(ProjectType).includes(type as ProjectType)) {
      where.type = type as ProjectType;
    }

    if (category) {
      where.category = { equals: category as string, mode: 'insensitive' };
    }

    if (status) {
      where.status = status as ProjectStatus;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.project.count({ where })
    ]);

    return res.json({
      success: true,
      data: items,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }
    });
  } catch (error) {
    console.error('getProjectsPublic error:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener proyectos.' });
  }
};

export const getProjectBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const item = await prisma.project.findUnique({ where: { slug } });

    if (!item || !item.isActive) {
      return res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener detalle del proyecto.' });
  }
};

export const createProject = async (req: ExtendedRequest & AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      type,
      category,
      description,
      status,
      startDate,
      endDate,
      technologies,
      clientName,
      location,
      budget,
      progressPercentage,
      isFeatured
    } = req.body;

    if (!title || !type || !category || !description) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios (título, tipo, categoría, descripción).' });
    }

    const imageWebp = req.fileWebpUrl || (req.filesWebpUrls && req.filesWebpUrls[0]) || '/assets/defaults/project-default.webp';
    const gallery = req.filesWebpUrls || [];
    const pdfDocument = req.pdfUrl || null;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-') + '-' + Date.now();

    const parsedTechs = typeof technologies === 'string' ? JSON.parse(technologies) : Array.isArray(technologies) ? technologies : [];

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        type: type as ProjectType,
        category,
        description,
        imageWebp,
        gallery,
        pdfDocument,
        status: (status as ProjectStatus) || ProjectStatus.IN_PROGRESS,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        technologies: parsedTechs,
        clientName: clientName || null,
        location: location || null,
        budget: budget ? parseFloat(budget) : null,
        progressPercentage: progressPercentage ? parseInt(progressPercentage, 10) : 0,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        createdBy: req.user?.userId
      }
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'CREATE_PROJECT',
      entity: 'Project',
      entityId: project.id,
      ipAddress: req.ip
    });

    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('createProject error:', error);
    return res.status(500).json({ success: false, message: 'Error al crear proyecto.' });
  }
};

export const updateProject = async (req: ExtendedRequest & AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      type,
      category,
      description,
      status,
      startDate,
      endDate,
      technologies,
      clientName,
      location,
      budget,
      progressPercentage,
      isFeatured
    } = req.body;

    const data: any = { updatedBy: req.user?.userId };

    if (title) {
      data.title = title;
      data.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-') + '-' + Date.now();
    }

    if (type) data.type = type as ProjectType;
    if (category) data.category = category;
    if (description) data.description = description;
    if (status) data.status = status as ProjectStatus;
    if (startDate) data.startDate = new Date(startDate);
    if (endDate) data.endDate = new Date(endDate);
    if (technologies) data.technologies = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
    if (clientName !== undefined) data.clientName = clientName;
    if (location !== undefined) data.location = location;
    if (budget !== undefined) data.budget = budget ? parseFloat(budget) : null;
    if (progressPercentage !== undefined) data.progressPercentage = parseInt(progressPercentage, 10);
    if (isFeatured !== undefined) data.isFeatured = isFeatured === 'true' || isFeatured === true;

    if (req.fileWebpUrl) data.imageWebp = req.fileWebpUrl;
    if (req.filesWebpUrls && req.filesWebpUrls.length > 0) data.gallery = req.filesWebpUrls;
    if (req.pdfUrl) data.pdfDocument = req.pdfUrl;

    const updated = await prisma.project.update({
      where: { id },
      data
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'UPDATE_PROJECT',
      entity: 'Project',
      entityId: id,
      ipAddress: req.ip
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al actualizar proyecto.' });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.project.update({
      where: { id },
      data: { isActive: false, updatedBy: req.user?.userId }
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'DELETE_PROJECT',
      entity: 'Project',
      entityId: id,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Proyecto eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al eliminar proyecto.' });
  }
};
