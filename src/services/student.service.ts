import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class StudentService {
  async getApprovedTeachers() {
    return await prisma.user.findMany({
      where: {
        role: 'TEACHER',
        isApproved: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}

export const studentService = new StudentService();
