import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import newsRoutes from './news.routes';
import projectRoutes from './project.routes';
import clientRoutes from './client.routes';
import testimonialRoutes from './testimonial.routes';
import contactRoutes from './contact.routes';
import settingRoutes from './setting.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/news', newsRoutes);
router.use('/projects', projectRoutes);
router.use('/clients', clientRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contacts', contactRoutes);
router.use('/settings', settingRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
