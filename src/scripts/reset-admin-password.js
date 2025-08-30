import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

dotenv.config();

const prisma = new PrismaClient();

async function resetToGmailAdmin() {
  try {
    console.log('🔄 Resetting Super Admin to admin@gmail.com...');
    try {
      const existingGmailUser = await prisma.user.findUnique({
        where: { email: 'admin@gmail.com' },
      });

      if (existingGmailUser && existingGmailUser.role !== 'SUPER_ADMIN') {
        await prisma.user.delete({
          where: { email: 'admin@gmail.com' },
        });
        console.log('🗑️  Deleted existing non-admin user with admin@gmail.com');
      }
    } catch (error) {}

    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });

    const targetPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(targetPassword, 10);

    if (existingSuperAdmin) {
      const updatedAdmin = await prisma.user.update({
        where: { id: existingSuperAdmin.id },
        data: {
          email: 'admin@gmail.com',
          password: hashedPassword,
          name: 'Super Administrator',
        },
      });

      console.log('Updated existing Super Admin to admin@gmail.com');
    } else {
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@gmail.com',
          password: hashedPassword,
          name: 'Super Administrator',
          role: 'SUPER_ADMIN',
          isApproved: true,
        },
      });

      console.log('Created new Super Admin with admin@gmail.com');
    }

    // Clean up any other super admins to avoid confusion
    await prisma.user.deleteMany({
      where: {
        role: 'SUPER_ADMIN',
        email: {
          not: 'admin@gmail.com',
        },
      },
    });

    console.log('🧹 Cleaned up any other Super Admin accounts');
    console.log('\n🎉 Setup Complete!');
    console.log('📧 Email: admin@gmail.com');
    console.log('🔐 Password: admin123');
    console.log('⚠️  Please change the password after first login');

    // Verify the setup
    const finalAdmin = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' },
    });

    if (finalAdmin && finalAdmin.role === 'SUPER_ADMIN') {
      console.log('\nVerification passed: admin@gmail.com is ready to use!');
    } else {
      console.log('\n Verification failed: Something went wrong!');
    }
  } catch (error) {
    console.error(' Error:', error.message);

    if (error.code === 'P2002') {
      console.log('\n💡 The email admin@gmail.com might already exist.');
      console.log(
        'Try running: node src/scripts/manage-admins.js for more options.',
      );
    }
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

resetToGmailAdmin();
