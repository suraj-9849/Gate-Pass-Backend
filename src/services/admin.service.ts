import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

class AdminService {
  async getPendingTeacherApprovals() {
    return await prisma.user.findMany({
      where: {
        role: 'TEACHER',
        isApproved: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async approveTeacher(teacherId: string) {
    const teacher = await prisma.user.findFirst({
      where: {
        id: teacherId,
        role: 'TEACHER',
      },
    });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    return await prisma.user.update({
      where: { id: teacherId },
      data: { isApproved: true },
    });
  }

  async rejectTeacher(teacherId: string) {
    const teacher = await prisma.user.findFirst({
      where: {
        id: teacherId,
        role: 'TEACHER',
      },
    });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    // Instead of deleting, we could also just mark as rejected
    return await prisma.user.delete({
      where: { id: teacherId },
    });
  }

  async getAllTeachers() {
    return await prisma.user.findMany({
      where: {
        role: 'TEACHER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        isApproved: true,
        createdAt: true,
      },
    });
  }
}

export const adminService = new AdminService();
