import { Router } from 'express';
import { getBudgets, getBudgetById, createBudget, updateBudget, deleteBudget } from '../controllers/budget.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadMemory, processWebpAndPdf } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', authenticateJWT, authorizeRoles('ADMIN', 'EDITOR', 'SUPERVISOR'), getBudgets);
router.get('/:id', authenticateJWT, authorizeRoles('ADMIN', 'EDITOR', 'SUPERVISOR'), getBudgetById);

router.post(
  '/',
  authenticateJWT,
  authorizeRoles('ADMIN', 'EDITOR'),
  uploadMemory.single('pdf'),
  processWebpAndPdf,
  createBudget
);

router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('ADMIN', 'EDITOR'),
  uploadMemory.single('pdf'),
  processWebpAndPdf,
  updateBudget
);

router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), deleteBudget);

export default router;
