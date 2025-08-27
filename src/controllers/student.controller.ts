import type { Response } from 'express';
import { studentService } from '../services/student.service.js';
import type { RequestWithUser } from '../types/index.js';

export class StudentController {
  async getApprovedTeachers(req: RequestWithUser, res: Response) {
    try {
      const teachers = await studentService.getApprovedTeachers();
      res.json(teachers);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const studentController = new StudentController();
