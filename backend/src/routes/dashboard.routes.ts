import { Router } from 'express';
import {
  getDashboardStats,
  getPublicStats,
  globalSearch,
  getAuditLogs,
  exportDatabaseBackup,
  recordSiteVisit
} from '../controllers/dashboard.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.get('/search', globalSearch);
router.get('/public-stats', getPublicStats);
router.post('/visit', recordSiteVisit);

// Protected Admin Endpoints
router.get('/stats', authenticateJWT, authorizeRoles('ADMIN', 'EDITOR', 'SUPERVISOR'), getDashboardStats);
router.get('/audit-logs', authenticateJWT, authorizeRoles('ADMIN'), getAuditLogs);
router.get('/backup', authenticateJWT, authorizeRoles('ADMIN'), exportDatabaseBackup);

export default router;
