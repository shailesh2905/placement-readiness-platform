import express from 'express';
import { getSkillGapAndPlan, toggleTaskProgress } from '../controllers/learningPlan.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // Requires authentication

router.get('/', getSkillGapAndPlan);
router.post('/progress', toggleTaskProgress);

export default router;
