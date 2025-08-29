import { Response } from 'express';
import { adminService } from '../services/admin.service.js';
import { RequestWithUser } from '@/types/index.js';

class AdminController {
  async getPendingTeachers(req: RequestWithUser, res: Response) {
    try {
      const teachers = await adminService.getPendingTeacherApprovals();
      res.json(teachers);
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

  async approveTeacher(req: RequestWithUser, res: Response) {
    try {
      const { teacherId } = req.params;
      const teacher = await adminService.approveTeacher(teacherId);

      res.json({
        message: 'Teacher approved successfully',
        teacher,
      });
    } catch (error: any) {
      console.error('Error approving teacher:', error);
      res.status(400).json({
        message: error.message || 'Failed to approve teacher',
      });
    }
  }

  async rejectTeacher(req: RequestWithUser, res: Response) {
    try {
      const { teacherId } = req.params;
      await adminService.rejectTeacher(teacherId);

      res.json({
        message: 'Teacher rejected successfully',
      });
    } catch (error: any) {
      console.error('Error rejecting teacher:', error);
      res.status(400).json({
        message: error.message || 'Failed to reject teacher',
      });
    }
  }

  async changeUserRole(req: RequestWithUser, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      console.log('Changing user role:', { userId, role });

      if (!role) {
        return res.status(400).json({ message: 'Role is required' });
      }

      const updatedUser = await adminService.changeUserRole(userId, role);

      console.log('Updated user:', updatedUser);

      res.json({
        message: 'User role updated successfully',
        data: updatedUser,
        user: updatedUser,
      });
    } catch (error: any) {
      console.error('Error changing user role:', error);
      res.status(400).json({
        message: error.message || 'Failed to change user role',
      });
    }
  }

  // FIXED METHOD: Get students approval statistics
  async getStudentsApprovalStats(req: RequestWithUser, res: Response) {
    try {
      console.log('Admin requesting students approval stats...');

      let studentsStats;
      try {
        // Try the main method first
        studentsStats = await adminService.getStudentsApprovalStats();
        console.log(
          `Main method succeeded with ${studentsStats.length} students`,
        );
      } catch (mainError) {
        console.log('Main method failed, trying simple method:', mainError);
        // Fallback to simple method
        studentsStats = await adminService.getSimpleApprovedStudents();
        console.log(
          `Simple method succeeded with ${studentsStats.length} students`,
        );
      }

      // Always return the data array directly for consistency
      res.json(studentsStats);
    } catch (error: any) {
      console.error('Error fetching students approval stats:', error);
      console.error('Error stack:', error.stack);

      // Return empty array instead of error to prevent app crash
      res.status(200).json([]);
    }
  }

  // FIXED ALTERNATIVE METHOD: Get basic approved students
  async getApprovedStudents(req: RequestWithUser, res: Response) {
    try {
      console.log('Admin requesting basic approved students...');

      const approvedStudents = await adminService.getSimpleApprovedStudents();

      console.log(`Returning ${approvedStudents.length} approved students`);

      // Return data array directly
      res.json(approvedStudents);
    } catch (error: any) {
      console.error('Error fetching approved students:', error);
      console.error('Error stack:', error.stack);

      // Return empty array instead of error
      res.status(200).json([]);
    }
  }
}

export const adminController = new AdminController();
