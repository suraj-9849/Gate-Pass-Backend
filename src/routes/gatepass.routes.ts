import { Router } from 'express';
import { gatePassController } from '../controllers/gatepass.controller.js';
import {
  authMiddleware,
  roleMiddleware,
} from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// Student routes
router.post(
  '/request',
  roleMiddleware(['STUDENT']),
  gatePassController.createGatePass,
);
router.get(
  '/student/passes',
  roleMiddleware(['STUDENT']),
  gatePassController.getStudentPasses,
);

// Teacher routes
router.post(
  '/approve/:gatePassId',
  roleMiddleware(['TEACHER']),
  gatePassController.approveGatePass,
);
router.post(
  '/reject/:gatePassId',
  roleMiddleware(['TEACHER']),
  gatePassController.rejectGatePass,
);
router.get(
  '/teacher/pending',
  roleMiddleware(['TEACHER']),
  gatePassController.getTeacherPendingApprovals,
);
router.get(
  '/teacher/approved',
  roleMiddleware(['TEACHER']),
  gatePassController.getTeacherApprovedRequests,
);

export const gatePassRoutes: Router = router;

// src/services/gatepass.service.ts - Updated with reject and teacher approved requests
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class GatePassService {
  async createGatePass(data: {
    studentId: string;
    reason: string;
    requestDate: Date;
    validUntil: Date;
  }) {
    return await prisma.gatePass.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
  }

  async approveGatePass(
    gatePassId: string,
    teacherId: string,
    remarks?: string,
  ) {
    const gatePass = await prisma.gatePass.findUnique({
      where: { id: gatePassId },
    });

    if (!gatePass) {
      throw new Error('Gate pass not found');
    }

    if (gatePass.status !== 'PENDING') {
      throw new Error('Gate pass cannot be approved');
    }

    // Generate QR code
    const qrCode = `GP-${gatePassId}-${Date.now()}`;

    return await prisma.gatePass.update({
      where: { id: gatePassId },
      data: {
        status: 'APPROVED',
        teacherId,
        remarks,
        qrCode,
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async rejectGatePass(
    gatePassId: string,
    teacherId: string,
    remarks?: string,
  ) {
    const gatePass = await prisma.gatePass.findUnique({
      where: { id: gatePassId },
    });

    if (!gatePass) {
      throw new Error('Gate pass not found');
    }

    if (gatePass.status !== 'PENDING') {
      throw new Error('Gate pass cannot be rejected');
    }

    return await prisma.gatePass.update({
      where: { id: gatePassId },
      data: {
        status: 'REJECTED',
        teacherId,
        remarks,
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getStudentPasses(studentId: string) {
    return await prisma.gatePass.findMany({
      where: { studentId },
      include: {
        teacher: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTeacherPendingApprovals() {
    return await prisma.gatePass.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getTeacherApprovedRequests(teacherId: string) {
    return await prisma.gatePass.findMany({
      where: {
        teacherId: teacherId,
        status: {
          in: ['APPROVED', 'USED', 'EXPIRED'],
        },
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
}

export const gatePassService = new GatePassService();
