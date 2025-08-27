import { PrismaClient } from '../generated/prisma/client.js';

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

  async approveGatePass(gatePassId: string, teacherId: string, remarks: string) {
    const gatePass = await prisma.gatePass.findUnique({
      where: { id: gatePassId },
    });

    if (!gatePass) {
      throw new Error('Gate pass not found');
    }

    if (gatePass.status !== 'PENDING') {
      throw new Error('Gate pass cannot be approved');
    }

    // Generate QR code here (we'll implement this later)
    const qrCode = `GP-${gatePassId}-${Date.now()}`;

    return await prisma.gatePass.update({
      where: { id: gatePassId },
      data: {
        status: 'APPROVED',
        teacherId,
        remarks,
        qrCode,
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
    });
  }

  async getTeacherPendingApprovals(teacherId: string) {
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
    });
  }
}

export const gatePassService = new GatePassService();
