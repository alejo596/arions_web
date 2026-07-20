import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ProjectType, ContactStatus } from '@prisma/client';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      totalNews,
      totalProjects,
      innovationProjects,
      constructionProjects,
      totalUsers,
      totalContacts,
      pendingContacts,
      recentContacts,
      recentProjects,
      recentAuditLogs
    ] = await Promise.all([
      prisma.news.count({ where: { isActive: true } }),
      prisma.project.count({ where: { isActive: true } }),
      prisma.project.count({ where: { isActive: true, type: ProjectType.INNOVATION } }),
      prisma.project.count({ where: { isActive: true, type: ProjectType.CONSTRUCTION } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.contact.count(),
      prisma.contact.count({ where: { status: ContactStatus.PENDING } }),
      prisma.contact.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      prisma.project.findMany({ take: 5, where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
      prisma.auditLog.findMany({ take: 10, include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' } })
    ]);

    // Chart.js data formatting
    const projectStatsChart = {
      labels: ['Innovación Tecnológica', 'Obras y Construcción'],
      datasets: [
        {
          label: 'Proyectos Registrados',
          data: [innovationProjects, constructionProjects],
          backgroundColor: ['#3b82f6', '#10b981']
        }
      ]
    };

    const contactStatusChart = {
      labels: ['Pendientes', 'Leídos', 'Respondidos'],
      datasets: [
        {
          label: 'Estado de Contactos',
          data: [
            pendingContacts,
            await prisma.contact.count({ where: { status: ContactStatus.READ } }),
            await prisma.contact.count({ where: { status: ContactStatus.REPLIED } })
          ],
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981']
        }
      ]
    };

    return res.json({
      success: true,
      data: {
        summary: {
          totalNews,
          totalProjects,
          innovationProjects,
          constructionProjects,
          totalUsers,
          totalContacts,
          pendingContacts
        },
        charts: {
          projectStatsChart,
          contactStatusChart
        },
        recentContacts,
        recentProjects,
        recentAuditLogs
      }
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener estadísticas del dashboard.' });
  }
};

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const { q = '' } = req.query;
    const query = (q as string).trim();

    if (!query || query.length < 2) {
      return res.json({ success: true, data: { news: [], projects: [] } });
    }

    const [news, projects] = await Promise.all([
      prisma.news.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5,
        select: { id: true, title: true, slug: true, summary: true, imageWebp: true }
      }),
      prisma.project.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5,
        select: { id: true, title: true, slug: true, type: true, category: true, imageWebp: true }
      })
    ]);

    return res.json({
      success: true,
      data: { news, projects }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error en búsqueda global.' });
  }
};

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = '1', limit = '15' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limitNum,
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.auditLog.count()
    ]);

    return res.json({
      success: true,
      data: logs,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener logs de auditoría.' });
  }
};

export const exportDatabaseBackup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [users, news, projects, clients, testimonials, contacts, settings] = await Promise.all([
      prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } }),
      prisma.news.findMany(),
      prisma.project.findMany(),
      prisma.client.findMany(),
      prisma.testimonial.findMany(),
      prisma.contact.findMany(),
      prisma.siteSetting.findMany()
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        users,
        news,
        projects,
        clients,
        testimonials,
        contacts,
        settings
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=arions_backup_${Date.now()}.json`);
    return res.send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al generar backup de base de datos.' });
  }
};

export const recordSiteVisit = async (req: Request, res: Response) => {
  try {
    const { path = '/' } = req.body;
    await prisma.siteVisit.create({
      data: {
        path,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false });
  }
};
