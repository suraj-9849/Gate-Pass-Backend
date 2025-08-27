import type { Response } from 'express';
import { adminService } from '../services/admin.service.js';
import type { RequestWithUser } from '../types/index.js';
import { UserRole } from '@prisma/client';

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

  async changeUserRole(req: RequestWithUser, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
      }

      const updatedUser = await adminService.changeUserRole(userId, role);
      res.json({
        message: 'User role updated successfully',
        user: updatedUser,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const adminController = new AdminController();
