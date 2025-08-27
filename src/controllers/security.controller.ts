import type { Response } from 'express';
import { securityService } from '../services/security.service.js';
import type { RequestWithUser } from '../types/index.js';

export class SecurityController {
  async scanGatePass(req: RequestWithUser, res: Response) {
    try {
      const { qrCode } = req.body;
      const securityId = req.user?.id;

      if (!securityId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!qrCode) {
        return res.status(400).json({ message: 'QR code is required' });
      }

      const scannedPass = await securityService.scanGatePass(
        qrCode,
        securityId,
      );

      res.json({
        message: 'Gate pass scanned successfully',
        data: scannedPass,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getScannedPasses(req: RequestWithUser, res: Response) {
    try {
      const securityId = req.user?.id;
      const scannedPasses = await securityService.getScannedPasses(securityId);
      res.json(scannedPasses);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getActivePasses(req: RequestWithUser, res: Response) {
    try {
      const activePasses = await securityService.getActivePasses();
      res.json(activePasses);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const securityController = new SecurityController();
