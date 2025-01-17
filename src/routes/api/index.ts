import { Router } from 'express';
const router = Router();
import thoughtsRoutes from './thoughtsRoutes.js';
import userRoutes from './userRoutes.js';

router.use('/thoughts', thoughtsRoutes);
router.use('/users', userRoutes);

export default router;
