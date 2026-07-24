import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ExtendedRequest } from '../middlewares/upload.middleware';
import { logAuditAction } from '../services/audit.service';
import { ProjectType } from '@prisma/client';

// Helper to calculate subtotal, IVA, and total
const calculateTotals = (items: any[]) => {
  let subtotal = 0;
  if (Array.isArray(items)) {
    subtotal = items.reduce((acc, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return acc + (quantity * unitPrice);
    }, 0);
  }
  const iva = Math.round(subtotal * 0.19 * 100) / 100;
  const total = Math.round((subtotal + iva) * 100) / 100;
  return { subtotal, iva, total };
};

export const getBudgets = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectType, search = '' } = req.query;

    const where: any = {};

    if (projectType && Object.values(ProjectType).includes(projectType as ProjectType)) {
      where.projectType = projectType as string;
    }

    if (search) {
      where.OR = [
        { clientName: { contains: search as string, mode: 'insensitive' } },
        { clientEmail: { contains: search as string, mode: 'insensitive' } },
        { clientRut: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const budgets = await prisma.budget.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            type: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: budgets });
  } catch (error) {
    console.error('getBudgets error:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener presupuestos.' });
  }
};

export const getBudgetById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            type: true
          }
        }
      }
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Presupuesto no encontrado.' });
    }

    return res.json({ success: true, data: budget });
  } catch (error) {
    console.error('getBudgetById error:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener el presupuesto.' });
  }
};

export const createBudget = async (req: ExtendedRequest & AuthenticatedRequest, res: Response) => {
  try {
    const { clientName, clientRut, clientEmail, projectType, projectId } = req.body;
    let { items } = req.body;

    if (!clientName || !clientEmail || !projectType) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
    }

    // Parse items if they come as a JSON string
    if (typeof items === 'string') {
      try {
        items = JSON.parse(items);
      } catch (e) {
        return res.status(400).json({ success: false, message: 'El formato de items es inválido.' });
      }
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Los items del presupuesto deben ser un arreglo.' });
    }

    const sanitizedItems = items.map((item: any) => ({
      description: String(item.description || ''),
      quantity: parseFloat(item.quantity) || 0,
      unitPrice: parseFloat(item.unitPrice) || 0
    }));

    const { subtotal, iva, total } = calculateTotals(sanitizedItems);
    const pdfUrl = req.pdfUrl || null;

    const budget = await prisma.budget.create({
      data: {
        clientName,
        clientRut: clientRut || null,
        clientEmail,
        projectType,
        projectId: projectId || null,
        items: sanitizedItems as any,
        subtotal,
        iva,
        total,
        pdfUrl
      }
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'CREATE',
      entity: 'BUDGET',
      entityId: budget.id,
      details: { clientName: budget.clientName, total: budget.total },
      ipAddress: req.ip
    });

    return res.status(201).json({ success: true, data: budget });
  } catch (error) {
    console.error('createBudget error:', error);
    return res.status(500).json({ success: false, message: 'Error al crear presupuesto.' });
  }
};

export const updateBudget = async (req: ExtendedRequest & AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { clientName, clientRut, clientEmail, projectType, projectId } = req.body;
    let { items } = req.body;

    const existingBudget = await prisma.budget.findUnique({ where: { id } });
    if (!existingBudget) {
      return res.status(404).json({ success: false, message: 'Presupuesto no encontrado.' });
    }

    const data: any = {};
    if (clientName !== undefined) data.clientName = clientName;
    if (clientRut !== undefined) data.clientRut = clientRut || null;
    if (clientEmail !== undefined) data.clientEmail = clientEmail;
    if (projectType !== undefined) data.projectType = projectType;
    if (projectId !== undefined) data.projectId = projectId || null;

    if (items !== undefined) {
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items);
        } catch (e) {
          return res.status(400).json({ success: false, message: 'El formato de items es inválido.' });
        }
      }

      if (!Array.isArray(items)) {
        return res.status(400).json({ success: false, message: 'Los items del presupuesto deben ser un arreglo.' });
      }

      const sanitizedItems = items.map((item: any) => ({
        description: String(item.description || ''),
        quantity: parseFloat(item.quantity) || 0,
        unitPrice: parseFloat(item.unitPrice) || 0
      }));

      data.items = sanitizedItems as any;
      const { subtotal, iva, total } = calculateTotals(sanitizedItems);
      data.subtotal = subtotal;
      data.iva = iva;
      data.total = total;
    }

    if (req.pdfUrl) {
      data.pdfUrl = req.pdfUrl;
    }

    const budget = await prisma.budget.update({
      where: { id },
      data
    });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'UPDATE',
      entity: 'BUDGET',
      entityId: budget.id,
      details: { clientName: budget.clientName, total: budget.total },
      ipAddress: req.ip
    });

    return res.json({ success: true, data: budget });
  } catch (error) {
    console.error('updateBudget error:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar presupuesto.' });
  }
};

export const deleteBudget = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existingBudget = await prisma.budget.findUnique({ where: { id } });
    if (!existingBudget) {
      return res.status(404).json({ success: false, message: 'Presupuesto no encontrado.' });
    }

    await prisma.budget.delete({ where: { id } });

    await logAuditAction({
      userId: req.user?.userId,
      action: 'DELETE',
      entity: 'BUDGET',
      entityId: id,
      details: { clientName: existingBudget.clientName, total: existingBudget.total },
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Presupuesto eliminado correctamente.' });
  } catch (error) {
    console.error('deleteBudget error:', error);
    return res.status(500).json({ success: false, message: 'Error al eliminar presupuesto.' });
  }
};
