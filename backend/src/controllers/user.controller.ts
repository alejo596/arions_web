import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword } from '../utils/auth';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { logAuditAction } from '../services/audit.service';
import { Role } from '@prisma/client';

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '', role } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isActive: true,
      OR: [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ]
    };

    if (role) {
      where.role = role as Role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return res.json({
      success: true,
      data: users,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener usuarios.' });
  }
};

export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nombre, email y contraseña son obligatorios.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado.' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || Role.EDITOR,
        createdBy: req.user?.userId
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'CREATE_USER',
      entity: 'User',
      entityId: newUser.id,
      ipAddress: req.ip
    });

    return res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al crear el usuario.' });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const data: any = { updatedBy: req.user?.userId };
    if (name) data.name = name;
    if (email) data.email = email;
    if (role) data.role = role;
    if (password) data.password = await hashPassword(password);

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, updatedAt: true }
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'UPDATE_USER',
      entity: 'User',
      entityId: id,
      ipAddress: req.ip
    });

    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al actualizar usuario.' });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Logical delete
    await prisma.user.update({
      where: { id },
      data: { isActive: false, updatedBy: req.user?.userId }
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'DELETE_USER',
      entity: 'User',
      entityId: id,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al eliminar usuario.' });
  }
};
