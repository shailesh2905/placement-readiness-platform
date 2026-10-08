import express from 'express';
import { getReadinessScore } from '../controllers/readiness.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // Require auth
router.get('/', authorize('STUDENT'), getReadinessScore);

export default router;
