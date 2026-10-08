import express from 'express';
import { getAssessments, getAssessmentById, submitAssessment, getAttemptById } from '../controllers/assessment.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All assessment routes require authentication

router.get('/', getAssessments);
router.get('/attempt/:attemptId', getAttemptById);
router.get('/:id', getAssessmentById);
router.post('/:id/submit', authorize('STUDENT'), submitAssessment);

export default router;
