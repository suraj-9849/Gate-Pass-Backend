// src/services/admin.service.ts - Complete implementation

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
        rollNo: true,
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
        rollNo: true,
        role: true,
        isApproved: true,
        createdAt: true,
      },
    });
  }

  // NEW METHOD: Get students who have been approved by teachers
  async getStudentsApprovalStats() {
    console.log('Getting students approval stats...');

    try {
      // First, let's get all students who have gate pass requests
      const studentsWithRequests = await prisma.user.findMany({
        where: {
          role: 'STUDENT',
          requestsSent: {
            some: {}, // Has at least one gate pass request
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          rollNo: true,
          createdAt: true,
          requestsSent: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              teacher: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      console.log(
        `Found ${studentsWithRequests.length} students with requests`,
      );

      // Transform the data to include statistics
      const studentsWithStats = studentsWithRequests.map((student) => {
        const requests = student.requestsSent;

        const totalRequests = requests.length;
        const approvedRequests = requests.filter((req) =>
          ['APPROVED', 'USED', 'EXPIRED'].includes(req.status),
        ).length;
        const pendingRequests = requests.filter(
          (req) => req.status === 'PENDING',
        ).length;
        const rejectedRequests = requests.filter(
          (req) => req.status === 'REJECTED',
        ).length;

        // Get unique teachers who approved this student's requests
        const approvingTeachers = Array.from(
          new Set(
            requests
              .filter((req) =>
                ['APPROVED', 'USED', 'EXPIRED'].includes(req.status),
              )
              .map((req) => req.teacher?.name)
              .filter(Boolean),
          ),
        ) as string[];

        const approvalRate =
          totalRequests > 0
            ? Math.round((approvedRequests / totalRequests) * 100)
            : 0;

        return {
          id: student.id,
          email: student.email,
          name: student.name,
          rollNo: student.rollNo,
          createdAt: student.createdAt,
          stats: {
            totalRequests,
            approvedRequests,
            pendingRequests,
            rejectedRequests,
            approvalRate,
            approvingTeachers,
          },
        };
      });

      // Filter to only include students with at least one approved request
      const approvedStudents = studentsWithStats.filter(
        (student) => student.stats.approvedRequests > 0,
      );

      console.log(
        `Returning ${approvedStudents.length} students with approved requests`,
      );

      return approvedStudents;
    } catch (error) {
      console.error('Error in getStudentsApprovalStats:', error);
      throw error;
    }
  }

  // Alternative simpler method if the above doesn't work
  async getSimpleApprovedStudents() {
    console.log('Getting simple approved students...');

    try {
      // Get students who have at least one approved gate pass
      const approvedStudents = await prisma.user.findMany({
        where: {
          role: 'STUDENT',
          requestsSent: {
            some: {
              status: {
                in: ['APPROVED', 'USED', 'EXPIRED'],
              },
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          rollNo: true,
          createdAt: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      console.log(`Found ${approvedStudents.length} approved students`);

      // Add basic stats for each student
      const studentsWithStats = await Promise.all(
        approvedStudents.map(async (student) => {
          const requests = await prisma.gatePass.findMany({
            where: { studentId: student.id },
            include: {
              teacher: {
                select: { name: true },
              },
            },
          });

          const totalRequests = requests.length;
          const approvedRequests = requests.filter((req) =>
            ['APPROVED', 'USED', 'EXPIRED'].includes(req.status),
          ).length;
          const pendingRequests = requests.filter(
            (req) => req.status === 'PENDING',
          ).length;
          const rejectedRequests = requests.filter(
            (req) => req.status === 'REJECTED',
          ).length;

          const approvingTeachers = Array.from(
            new Set(
              requests
                .filter((req) =>
                  ['APPROVED', 'USED', 'EXPIRED'].includes(req.status),
                )
                .map((req) => req.teacher?.name)
                .filter(Boolean),
            ),
          ) as string[];

          const approvalRate =
            totalRequests > 0
              ? Math.round((approvedRequests / totalRequests) * 100)
              : 0;

          return {
            ...student,
            stats: {
              totalRequests,
              approvedRequests,
              pendingRequests,
              rejectedRequests,
              approvalRate,
              approvingTeachers,
            },
          };
        }),
      );

      return studentsWithStats;
    } catch (error) {
      console.error('Error in getSimpleApprovedStudents:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
