import { Router } from 'express';
import { getClients, createClient, deleteClient } from '../controllers/client.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadMemory, processWebpAndPdf } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', getClients);
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('ADMIN', 'EDITOR'),
  uploadMemory.single('logo'),
  processWebpAndPdf,
  createClient
);
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), deleteClient);

export default router;
