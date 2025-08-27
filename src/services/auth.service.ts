import { PrismaClient } from '../generated/prisma/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

class AuthService {
  async registerUser(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        isApproved: userData.role === 'STUDENT',
      },
    });

    const token = this.generateToken(user);

    return { user, token };
  }

  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error('Invalid password');
    }

    if (!user.isApproved && user.role !== 'STUDENT') {
      throw new Error('Account pending approval');
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  async createSuperAdmin(email: string, password: string, name: string) {
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (existingSuperAdmin) {
    throw new Error('Super Admin already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const superAdmin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'SUPER_ADMIN',
      isApproved: true,
    },
  });

  const token = this.generateToken(superAdmin);
  return { user: superAdmin, token };
}

  private generateToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }
}

export const authService = new AuthService();
