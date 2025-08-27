import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class SecurityService {
  async scanGatePass(qrCode: string, securityId: string) {
    const gatePass = await prisma.gatePass.findFirst({
      where: {
        qrCode: qrCode,
        status: 'APPROVED',
      },
      include: {
        student: {
          select: {
            id: true,
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

    if (!gatePass) {
      throw new Error('Invalid or expired gate pass');
    }

    // Check if the pass is still valid
    if (new Date() > new Date(gatePass.validUntil)) {
      await prisma.gatePass.update({
        where: { id: gatePass.id },
        data: { status: 'EXPIRED' },
      });
      throw new Error('Gate pass has expired');
    }

    // Mark the pass as used
    const updatedPass = await prisma.gatePass.update({
      where: { id: gatePass.id },
      data: {
        status: 'USED',
        usedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
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

    // Create a scan log entry
    await prisma.scanLog.create({
      data: {
        gatePassId: gatePass.id,
        securityId: securityId,
        scannedAt: new Date(),
      },
    });

    return updatedPass;
  }

  async getScannedPasses(securityId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await prisma.gatePass.findMany({
      where: {
        status: 'USED',
        usedAt: {
          gte: today,
          lt: tomorrow,
        },
        ...(securityId && {
          scanLogs: {
            some: {
              securityId: securityId,
            },
          },
        }),
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
      orderBy: {
        usedAt: 'desc',
      },
    });
  }

  async getActivePasses() {
    const now = new Date();

    return await prisma.gatePass.findMany({
      where: {
        status: 'APPROVED',
        validUntil: {
          gte: now,
        },
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
      orderBy: {
        validUntil: 'asc',
      },
    });
  }
}

export const securityService = new SecurityService();
