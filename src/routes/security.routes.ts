import { Router } from 'express';
import { securityController } from '../controllers/security.controller.js';
import {
  authMiddleware,
  roleMiddleware,
} from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authMiddleware);
router.use(roleMiddleware(['SECURITY']));
router.post('/scan-pass', securityController.scanGatePass);
router.get('/scanned-passes', securityController.getScannedPasses);
router.get('/active-passes', securityController.getActivePasses);

export const securityRoutes: Router = router;
