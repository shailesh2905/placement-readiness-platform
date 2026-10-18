import express from 'express';
import { getProfile, updateProfile, addEducation, uploadResume } from '../controllers/profile.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadResumeFile } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect); // All profile routes require authentication

router.route('/')
  .get(getProfile)
  .put(updateProfile);

router.post('/education', authorize('STUDENT'), addEducation);
router.post('/upload-resume', authorize('STUDENT'), uploadResumeFile.single('file'), uploadResume);

export default router;

