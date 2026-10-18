import express from 'express';
import { getMentorStudents, submitMentorFeedback } from '../controllers/mentor.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('MENTOR', 'ADMIN')); // Mentors & Admins can access

router.get('/students', getMentorStudents);
router.post('/feedback', submitMentorFeedback);

export default router;
