import type { Response } from 'express';
import { adminService } from '../services/admin.service.js';
import type { RequestWithUser } from '../types/index.js';

export class AdminController {
  async getPendingTeachers(req: RequestWithUser, res: Response) {
    try {
      const pendingTeachers = await adminService.getPendingTeacherApprovals();
      res.json(pendingTeachers);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async approveTeacher(req: RequestWithUser, res: Response) {
    try {
      const { teacherId } = req.params;
      const updatedTeacher = await adminService.approveTeacher(teacherId);
      res.json({
        message: 'Teacher approved successfully',
        teacher: updatedTeacher,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async rejectTeacher(req: RequestWithUser, res: Response) {
    try {
      const { teacherId } = req.params;
      await adminService.rejectTeacher(teacherId);
      res.json({ message: 'Teacher rejected successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllTeachers(req: RequestWithUser, res: Response) {
    try {
      const teachers = await adminService.getAllTeachers();
      res.json(teachers);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const adminController = new AdminController();
