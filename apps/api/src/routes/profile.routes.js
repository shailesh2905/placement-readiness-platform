import express from 'express';
import {
  getProfile,
  updateProfile,
  addEducation,
  uploadResume,
  addProject,
  deleteProject,
  addExperience,
  deleteExperience,
  addSkillManual,
  deleteSkill
} from '../controllers/profile.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadResumeFile } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect); // All profile routes require authentication

router.route('/')
  .get(getProfile)
  .put(updateProfile);

router.post('/education', authorize('STUDENT'), addEducation);
router.post('/upload-resume', authorize('STUDENT'), uploadResumeFile.single('file'), uploadResume);

// Projects routes
router.post('/project', authorize('STUDENT'), addProject);
router.delete('/project/:id', authorize('STUDENT'), deleteProject);

// Experience routes
router.post('/experience', authorize('STUDENT'), addExperience);
router.delete('/experience/:id', authorize('STUDENT'), deleteExperience);

// Manual Skills routes
router.post('/skill', authorize('STUDENT'), addSkillManual);
router.delete('/skill/:skillId', authorize('STUDENT'), deleteSkill);

export default router;

