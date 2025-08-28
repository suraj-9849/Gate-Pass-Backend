import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

dotenv.config();

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    console.log('Finding Super Admin account...');

    // Find the existing super admin
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });

    if (!superAdmin) {
      console.log('No Super Admin found!');
      return;
    }

    console.log('👤 Found Super Admin:', superAdmin.email);
    console.log('🔐 Resetting password to: Suraj@1234');

    // Hash the new password
    const hashedPassword = await bcrypt.hash('Suraj@1234', 10);

    // Update the password
    await prisma.user.update({
      where: { id: superAdmin.id },
      data: { password: hashedPassword },
    });

    console.log(' Password reset successfully!');
    console.log('📧 Email:', superAdmin.email);
    console.log('🔐 New Password: Suraj@1234');
    console.log('⚠️  Please change this password after login');
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

resetAdminPassword();
