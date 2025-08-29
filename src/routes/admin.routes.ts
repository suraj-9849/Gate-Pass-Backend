// src/routes/admin.routes.ts - Complete routes file

import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import {
  authMiddleware,
  roleMiddleware,
} from '../middlewares/auth.middleware.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);
router.use(roleMiddleware(['SUPER_ADMIN']));

// Teacher management routes
router.get('/teachers/pending', adminController.getPendingTeachers);
router.get('/teachers', adminController.getAllTeachers);
router.post('/teachers/:teacherId/approve', adminController.approveTeacher);
router.post('/teachers/:teacherId/reject', adminController.rejectTeacher);

// User role management routes
router.patch('/users/:userId/role', adminController.changeUserRole);

// Approved students routes (NEW)
router.get(
  '/students/approval-stats',
  adminController.getStudentsApprovalStats,
);
router.get('/students/approved', adminController.getApprovedStudents);

export const adminRoutes: Router = router;
