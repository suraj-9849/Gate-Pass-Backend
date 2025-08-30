import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

dotenv.config();

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    const targetEmail = 'admin@gmail.com';
    const targetPassword = 'admin123';
    const targetName = 'Super Administrator';

    console.log(' Checking for existing Super Admin...');

    // Check if super admin with target email already exists
    const existingTargetAdmin = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (existingTargetAdmin) {
      console.log(`Super Admin with ${targetEmail} already exists!`);
      console.log('📧 Email:', targetEmail);
      console.log('🔐 Password: admin123');
      return;
    }

    // Check for any existing super admin
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });

    if (existingSuperAdmin) {
      console.log('⚠️  Found existing Super Admin:', existingSuperAdmin.email);
      console.log('🔄 Options:');
      console.log('1. Update existing admin email to admin@gmail.com');
      console.log('2. Create new admin@gmail.com (multiple super admins)');
      console.log('3. Delete existing and create new one');

      // For automation, let's update the existing one
      console.log('🔄 Updating existing Super Admin to admin@gmail.com...');

      const hashedPassword = await bcrypt.hash(targetPassword, 10);

      const updatedAdmin = await prisma.user.update({
        where: { id: existingSuperAdmin.id },
        data: {
          email: targetEmail,
          password: hashedPassword,
          name: targetName,
        },
      });

      console.log('Super Admin updated successfully!');
      console.log('📧 Email:', targetEmail);
      console.log('🔐 Password: admin123');
      console.log('⚠️  Please change the password after first login');
      return;
    }

    // No super admin exists, create new one
    console.log('🆕 Creating new Super Admin account...');

    const hashedPassword = await bcrypt.hash(targetPassword, 10);

    const superAdmin = await prisma.user.create({
      data: {
        email: targetEmail,
        password: hashedPassword,
        name: targetName,
        role: 'SUPER_ADMIN',
        isApproved: true,
      },
    });

    console.log('Super Admin created successfully!');
    console.log('📧 Email:', targetEmail);
    console.log('🔐 Password: admin123');
    console.log('⚠️  Please change the password after first login');
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      console.log(
        ' Error: Email admin@gmail.com already exists but with different role!',
      );
      console.log('💡 Try using a different email or check existing users.');
    } else {
      console.error(' Error creating Super Admin:', error.message);
    }
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

createSuperAdmin();
