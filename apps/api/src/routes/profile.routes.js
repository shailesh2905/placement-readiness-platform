import express from 'express';
import { getProfile, updateProfile, addEducation } from '../controllers/profile.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All profile routes require authentication

router.route('/')
  .get(getProfile)
  .put(updateProfile);

router.post('/education', authorize('STUDENT'), addEducation);

// Placeholder for other endpoints (projects, skills, etc.)

export default router;
