import type { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface RequestWithUser extends Request {
  user?: UserPayload;
}

export interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface GatePassInput {
  studentId: string;
  reason: string;
  requestDate: Date;
  validUntil: Date;
}
