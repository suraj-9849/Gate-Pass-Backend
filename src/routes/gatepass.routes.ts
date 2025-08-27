import { Router } from 'express';
import { gatePassController } from '../controllers/gatepass.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// Student routes
router.post(
  '/request',
  roleMiddleware(['STUDENT']),
  gatePassController.createGatePass
);
router.get(
  '/student/passes',
  roleMiddleware(['STUDENT']),
  gatePassController.getStudentPasses
);

// Teacher routes
router.post(
  '/approve/:gatePassId',
  roleMiddleware(['TEACHER']),
  gatePassController.approveGatePass
);
router.get(
  '/teacher/pending',
  roleMiddleware(['TEACHER']),
  gatePassController.getTeacherPendingApprovals
);

export const gatePassRoutes:Router = router;
