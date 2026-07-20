import { Router } from 'express';
import { getSiteSettings, updateSiteSettings } from '../controllers/setting.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadMemory, processWebpAndPdf } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', getSiteSettings);
router.put(
  '/',
  authenticateJWT,
  authorizeRoles('ADMIN'),
  uploadMemory.single('logo'),
  processWebpAndPdf,
  updateSiteSettings
);

export default router;
