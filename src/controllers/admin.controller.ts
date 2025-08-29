// src/controllers/admin.controller.ts - Add these methods

import type { Request, Response } from 'express';
import { adminService } from '../services/admin.service.js';
import type { RequestWithUser } from '../types/index.js';

export class AdminController {
  // ... existing methods ...

  async getPendingTeachers(req: RequestWithUser, res: Response) {
    try {
      const pendingTeachers = await adminService.getPendingTeacherApprovals();
      res.json(pendingTeachers);
    } catch (error: any) {
      console.error('Error fetching pending teachers:', error);
      res.status(400).json({
        message: error.message || 'Failed to fetch pending teachers',
      });
    }
  }

  async getAllTeachers(req: RequestWithUser, res: Response) {
    try {
      const allUsers = await adminService.getAllTeachers();
      res.json(allUsers);
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      res.status(400).json({
        message: error.message || 'Failed to fetch users',
      });
    }
  }

  async approveTeacher(req: RequestWithUser, res: Response) {
    try {
      const { teacherId } = req.params;
      const approvedTeacher = await adminService.approveTeacher(teacherId);

      res.json({
        message: 'Teacher approved successfully',
        data: approvedTeacher,
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

  // NEW METHOD: Get students approval statistics
  async getStudentsApprovalStats(req: RequestWithUser, res: Response) {
    try {
      console.log('Admin requesting students approval stats...');

      // Try the main method first
      let studentsStats;
      try {
        studentsStats = await adminService.getStudentsApprovalStats();
      } catch (mainError) {
        console.log('Main method failed, trying simple method:', mainError);
        // Fallback to simple method
        studentsStats = await adminService.getSimpleApprovedStudents();
      }

      console.log(
        `Returning ${studentsStats.length} students with approval stats`,
      );

      res.json({
        message: 'Students approval statistics fetched successfully',
        data: studentsStats,
        count: studentsStats.length,
      });
    } catch (error: any) {
      console.error('Error fetching students approval stats:', error);
      console.error('Error stack:', error.stack);

      // Return empty array instead of error to prevent app crash
      res.json({
        message: 'No approved students found',
        data: [],
        count: 0,
        error: error.message,
      });
    }
  }

  // ALTERNATIVE METHOD: Get basic approved students
  async getApprovedStudents(req: RequestWithUser, res: Response) {
    try {
      console.log('Admin requesting basic approved students...');

      const approvedStudents = await adminService.getSimpleApprovedStudents();

      console.log(`Returning ${approvedStudents.length} approved students`);

      res.json({
        message: 'Approved students fetched successfully',
        data: approvedStudents,
        count: approvedStudents.length,
      });
    } catch (error: any) {
      console.error('Error fetching approved students:', error);

      res.json({
        message: 'No approved students found',
        data: [],
        count: 0,
        error: error.message,
      });
    }
  }
}

export const adminController = new AdminController();
