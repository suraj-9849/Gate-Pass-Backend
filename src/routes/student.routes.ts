import { Router } from 'express';
import { studentController } from '../controllers/student.controller.js';
import {
  authMiddleware,
  roleMiddleware,
} from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['STUDENT']));
router.get('/teachers', studentController.getApprovedTeachers);

export const studentRoutes: Router = router;
