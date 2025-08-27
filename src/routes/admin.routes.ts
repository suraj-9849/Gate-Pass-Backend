import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication and SUPER_ADMIN role
router.use(authMiddleware);
router.use(roleMiddleware(['SUPER_ADMIN']));

// Teacher approval management routes
router.get('/teachers/pending', adminController.getPendingTeachers);
router.get('/teachers', adminController.getAllTeachers);
router.post('/teachers/:teacherId/approve', adminController.approveTeacher);
router.post('/teachers/:teacherId/reject', adminController.rejectTeacher);

export const adminRoutes = router;
