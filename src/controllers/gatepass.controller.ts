import type { Request, Response } from 'express';
import { gatePassService } from '../services/gatepass.service.js';
import type { RequestWithUser } from '../types/index.js';

export class GatePassController {
  async createGatePass(req: RequestWithUser, res: Response) {
    try {
      const { reason, requestDate, validUntil, teacherId }: any = req.body;
      const studentId = req.user?.id;

      if (!studentId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!teacherId) {
        return res
          .status(400)
          .json({ message: 'Teacher selection is required' });
      }

      const gatePass = await gatePassService.createGatePass({
        studentId,
        teacherId, // Include teacher ID
        reason,
        requestDate: new Date(requestDate),
        validUntil: new Date(validUntil),
      });

      res.status(201).json({
        message: 'Gate pass request sent successfully',
        data: gatePass,
      });
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

      res.json({
        message: 'Gate pass approved successfully',
        data: gatePass,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async rejectGatePass(req: RequestWithUser, res: Response) {
    try {
      const { gatePassId } = req.params;
      const { remarks }: any = req.body;
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const gatePass = await gatePassService.rejectGatePass(
        gatePassId,
        teacherId,
        remarks,
      );

      res.json({
        message: 'Gate pass rejected successfully',
        data: gatePass,
      });
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

      // Pass teacherId to only get requests assigned to this teacher
      const passes =
        await gatePassService.getTeacherPendingApprovals(teacherId);
      res.json(passes);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getTeacherApprovedRequests(req: RequestWithUser, res: Response) {
    try {
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const passes =
        await gatePassService.getTeacherApprovedRequests(teacherId);
      res.json(passes);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const gatePassController = new GatePassController();
