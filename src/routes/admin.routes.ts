import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import {
  authMiddleware,
  roleMiddleware,
} from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authMiddleware);
router.use(roleMiddleware(['SUPER_ADMIN']));

// Teacher approval management routes
router.get('/teachers/pending', adminController.getPendingTeachers);
router.get('/teachers', adminController.getAllTeachers);
router.post('/teachers/:teacherId/approve', adminController.approveTeacher);
router.post('/teachers/:teacherId/reject', adminController.rejectTeacher);
router.patch('/users/:userId/role', adminController.changeUserRole);

export const adminRoutes: Router = router;
