import express from 'express';
import { getAdminAnalytics, getStudentsRoster, exportRosterCSV } from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // Protected
router.use(authorize('ADMIN', 'MENTOR')); // Admins and Mentors can access

router.get('/analytics', getAdminAnalytics);
router.get('/students', getStudentsRoster);
router.get('/export-csv', exportRosterCSV);

export default router;
