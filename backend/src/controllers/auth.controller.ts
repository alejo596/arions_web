import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { comparePasswords, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/auth';
import { logAuditAction } from '../services/audit.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas o cuenta desactivada.' });
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt
      }
    });

    await logAuditAction({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Error interno en el servidor.' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Refresh token requerido.' });
    }

    const existingToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!existingToken || existingToken.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Refresh token inválido o expirado.' });
    }

    const payload = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken({ userId: payload.userId, email: payload.email, role: payload.role });

    return res.json({
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Refresh token inválido.' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'No autenticado.' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true }
    });

    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno en el servidor.' });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { refreshToken: token } = req.body;
    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }

    if (req.user) {
      await logAuditAction({
        userId: req.user.userId,
        action: 'LOGOUT',
        entity: 'User',
        entityId: req.user.userId,
        ipAddress: req.ip
      });
    }

    return res.json({ success: true, message: 'Sesión cerrada correctamente.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al cerrar sesión.' });
  }
};
