import { Router } from 'express';
import { createContact, getContactsAdmin, updateContactStatus } from '../controllers/contact.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createContact);
router.get('/admin/list', authenticateJWT, authorizeRoles('ADMIN', 'EDITOR', 'SUPERVISOR'), getContactsAdmin);
router.put('/:id/status', authenticateJWT, authorizeRoles('ADMIN', 'EDITOR'), updateContactStatus);

export default router;
