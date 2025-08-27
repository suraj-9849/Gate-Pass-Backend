import type { Request, Response } from 'express';
import { gatePassService } from '../services/gatepass.service.js';
import type { RequestWithUser } from '../types/index.js';

export class GatePassController {
  async createGatePass(req: RequestWithUser, res: Response) {
    try {
      const { reason, requestDate, validUntil }: any = req.body;
      const studentId = req.user?.id;

      if (!studentId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const gatePass = await gatePassService.createGatePass({
        studentId,
        reason,
        requestDate: new Date(requestDate),
        validUntil: new Date(validUntil),
      });

      res.status(201).json(gatePass);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async approveGatePass(req: RequestWithUser, res: Response) {
    try {
      const { gatePassId } = req.params;
      const { remarks }: any = req.body;
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const gatePass = await gatePassService.approveGatePass(
        gatePassId,
        teacherId,
        remarks,
      );

      res.json(gatePass);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getStudentPasses(req: RequestWithUser, res: Response) {
    try {
      const studentId = req.user?.id;

      if (!studentId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const passes = await gatePassService.getStudentPasses(studentId);
      res.json(passes);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getTeacherPendingApprovals(req: RequestWithUser, res: Response) {
    try {
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const passes =
        await gatePassService.getTeacherPendingApprovals(teacherId);
      res.json(passes);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const gatePassController = new GatePassController();
