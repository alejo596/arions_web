import { Router } from 'express';
import {
  getNewsPublic,
  getNewsBySlug,
  getNewsAdmin,
  createNews,
  updateNews,
  deleteNews,
  getCategories
} from '../controllers/news.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadMemory, processWebpAndPdf } from '../middlewares/upload.middleware';

const router = Router();

// Public routes
router.get('/', getNewsPublic);
router.get('/categories', getCategories);
router.get('/slug/:slug', getNewsBySlug);

// Admin routes
router.get('/admin/list', authenticateJWT, authorizeRoles('ADMIN', 'EDITOR', 'SUPERVISOR'), getNewsAdmin);
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('ADMIN', 'EDITOR'),
  uploadMemory.single('image'),
  processWebpAndPdf,
  createNews
);
router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('ADMIN', 'EDITOR'),
  uploadMemory.single('image'),
  processWebpAndPdf,
  updateNews
);
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), deleteNews);

export default router;
