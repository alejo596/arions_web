import { Router } from 'express';
import { getTestimonials, createTestimonial, deleteTestimonial } from '../controllers/testimonial.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadMemory, processWebpAndPdf } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', getTestimonials);
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('ADMIN', 'EDITOR'),
  uploadMemory.single('avatar'),
  processWebpAndPdf,
  createTestimonial
);
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), deleteTestimonial);

export default router;
