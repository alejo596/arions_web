import { prisma } from '../utils/prisma';

export const logAuditAction = async (params: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        details: params.details ? params.details : undefined,
        ipAddress: params.ipAddress || '127.0.0.1'
      }
    });
  } catch (err) {
    console.error('Audit Log Error:', err);
  }
};
