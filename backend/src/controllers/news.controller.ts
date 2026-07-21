import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ExtendedRequest } from '../middlewares/upload.middleware';
import { logAuditAction } from '../services/audit.service';
import { NewsStatus } from '@prisma/client';

export const getNewsPublic = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '6', category, tag, search = '' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isActive: true,
      status: NewsStatus.PUBLISHED,
      publishedAt: { lte: new Date() },
      OR: [
        { title: { contains: search as string, mode: 'insensitive' } },
        { summary: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } }
      ]
    };

    if (category) {
      where.category = { slug: category as string };
    }

    if (tag) {
      where.tags = { has: tag as string };
    }

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          author: { select: { name: true, avatarUrl: true } }
        },
        skip,
        take: limitNum,
        orderBy: { publishedAt: 'desc' }
      }),
      prisma.news.count({ where })
    ]);

    return res.json({
      success: true,
      data: items,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('getNewsPublic error:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener noticias.' });
  }
};

export const getNewsBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const item = await prisma.news.findUnique({
      where: { slug },
      include: {
        category: true,
        author: { select: { name: true, avatarUrl: true } }
      }
    });

    if (!item || !item.isActive) {
      return res.status(404).json({ success: false, message: 'Noticia no encontrada.' });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener noticia.' });
  }
};

export const getNewsAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isActive: true,
      OR: [
        { title: { contains: search as string, mode: 'insensitive' } },
        { summary: { contains: search as string, mode: 'insensitive' } }
      ]
    };

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          category: { select: { name: true } },
          author: { select: { name: true } }
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.news.count({ where })
    ]);

    return res.json({
      success: true,
      data: items,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener noticias del panel.' });
  }
};

export const createNews = async (req: ExtendedRequest & AuthenticatedRequest, res: Response) => {
  try {
    const { title, summary, content, categoryId, status, tags, publishedAt } = req.body;

    if (!title || !summary || !content || !categoryId) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios para la noticia.' });
    }

    const imageWebp = req.fileWebpUrl || '/assets/defaults/news-default.webp';
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now();

    let parsedTags: string[] = [];
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    const newNews = await prisma.news.create({
      data: {
        title,
        slug,
        summary,
        content,
        imageWebp,
        categoryId,
        authorId: req.user?.userId || '',
        status: status || NewsStatus.PUBLISHED,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        tags: parsedTags,
        createdBy: req.user?.userId
      }
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'CREATE_NEWS',
      entity: 'News',
      entityId: newNews.id,
      ipAddress: req.ip
    });

    return res.status(201).json({ success: true, data: newNews });
  } catch (error) {
    console.error('createNews Error:', error);
    return res.status(500).json({ success: false, message: 'Error al crear la noticia.' });
  }
};

export const updateNews = async (req: ExtendedRequest & AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, summary, content, categoryId, status, tags, publishedAt } = req.body;

    const data: any = { updatedBy: req.user?.userId };

    if (title) {
      data.title = title;
      data.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-') + '-' + Date.now();
    }
    if (summary) data.summary = summary;
    if (content) data.content = content;
    if (categoryId) data.categoryId = categoryId;
    if (status) data.status = status;
    if (publishedAt) data.publishedAt = new Date(publishedAt);
    if (tags) {
      if (typeof tags === 'string') {
        try {
          data.tags = JSON.parse(tags);
        } catch {
          data.tags = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
      } else if (Array.isArray(tags)) {
        data.tags = tags;
      }
    }
    if (req.fileWebpUrl) data.imageWebp = req.fileWebpUrl;

    const updated = await prisma.news.update({
      where: { id },
      data
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'UPDATE_NEWS',
      entity: 'News',
      entityId: id,
      ipAddress: req.ip
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('updateNews Error:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar la noticia.' });
  }
};

export const deleteNews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.news.update({
      where: { id },
      data: { isActive: false, updatedBy: req.user?.userId }
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'DELETE_NEWS',
      entity: 'News',
      entityId: id,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Noticia eliminada correctamente.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al eliminar la noticia.' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.newsCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    return res.json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener categorías.' });
  }
};
