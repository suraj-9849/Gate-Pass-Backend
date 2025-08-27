import { PrismaClient, UserRole } from '@prisma/client';

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
        role: {
          in: ['TEACHER', 'STUDENT', 'SECURITY', 'SUPER_ADMIN'],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isApproved: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async changeUserRole(userId: string, newRole: UserRole) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Don't allow changing the role of the current super admin if it's the only one
    if (user.role === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({
        where: { role: 'SUPER_ADMIN' },
      });

      if (superAdminCount <= 1 && newRole !== 'SUPER_ADMIN') {
        throw new Error('Cannot change role of the last Super Admin');
      }
    }

    // Set approval status based on role
    const isApproved =
      newRole === 'STUDENT' || newRole === 'SUPER_ADMIN' ? true : false;

    return await prisma.user.update({
      where: { id: userId },
      data: {
        role: newRole,
        isApproved,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isApproved: true,
        createdAt: true,
      },
    });
  }
}

export const adminService = new AdminService();
