import { Router } from 'express';
import { login, refreshToken, getMe, logout } from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', authenticateJWT, getMe);
router.post('/logout', authenticateJWT, logout);

export default router;
