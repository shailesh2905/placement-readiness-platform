import express from 'express';
import { getDrives, applyToDrive } from '../controllers/drives.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('STUDENT', 'ADMIN', 'MENTOR'), getDrives);
router.post('/:id/apply', authorize('STUDENT'), applyToDrive);

export default router;
