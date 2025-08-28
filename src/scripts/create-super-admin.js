import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

dotenv.config();

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('��� Checking for existing Super Admin...');

    // Check if super admin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });

    if (existingSuperAdmin) {
      console.log(' Super Admin already exists:', existingSuperAdmin.email);
      return;
    }

    console.log('��� Creating Super Admin account...');

    // Create the super admin account
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const superAdmin = await prisma.user.create({
      data: {
        email: 'admin@gatepass.com',
        password: hashedPassword,
        name: 'Super Administrator',
        role: 'SUPER_ADMIN',
        isApproved: true,
      },
    });

    console.log('Super Admin created successfully!');
    console.log('Email: admin@gatepass.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login');
  } catch (error) {
    console.error('Error creating Super Admin:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

createSuperAdmin();
