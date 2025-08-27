import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class GatePassService {
  async createGatePass(data: {
    studentId: string;
    teacherId: string;
    reason: string;
    requestDate: Date;
    validUntil: Date;
  }) {
    // Verify the teacher exists and is approved
    const teacher = await prisma.user.findFirst({
      where: {
        id: data.teacherId,
        role: 'TEACHER',
        isApproved: true,
      },
    });

    if (!teacher) {
      throw new Error('Selected teacher is not available');
    }

    return await prisma.gatePass.create({
      data: {
        studentId: data.studentId,
        teacherId: data.teacherId,
        reason: data.reason,
        requestDate: data.requestDate,
        validUntil: data.validUntil,
        status: 'PENDING',
      },
      include: {
        teacher: {
          select: {
            name: true,
            email: true,
          },
        },
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

    // Verify the teacher is authorized to approve this request
    if (gatePass.teacherId !== teacherId) {
      throw new Error('You are not authorized to approve this gate pass');
    }

    // Generate QR code
    const qrCode = `GP-${gatePassId}-${Date.now()}`;

    return await prisma.gatePass.update({
      where: { id: gatePassId },
      data: {
        status: 'APPROVED',
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
        teacher: {
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

    // Verify the teacher is authorized to reject this request
    if (gatePass.teacherId !== teacherId) {
      throw new Error('You are not authorized to reject this gate pass');
    }

    return await prisma.gatePass.update({
      where: { id: gatePassId },
      data: {
        status: 'REJECTED',
        remarks,
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        teacher: {
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

  async getTeacherPendingApprovals(teacherId: string) {
    return await prisma.gatePass.findMany({
      where: {
        status: 'PENDING',
        teacherId: teacherId, // Only show requests assigned to this teacher
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
