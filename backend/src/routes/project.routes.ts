import { Router } from 'express';
import {
  getProjectsPublic,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/project.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadMemory, processWebpAndPdf } from '../middlewares/upload.middleware';

const router = Router();

// Public routes
router.get('/', getProjectsPublic);
router.get('/slug/:slug', getProjectBySlug);

// Admin routes
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('ADMIN', 'EDITOR'),
  uploadMemory.array('files', 10),
  processWebpAndPdf,
  createProject
);
router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('ADMIN', 'EDITOR'),
  uploadMemory.array('files', 10),
  processWebpAndPdf,
  updateProject
);
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), deleteProject);

export default router;
