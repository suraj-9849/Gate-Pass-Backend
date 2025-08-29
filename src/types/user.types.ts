export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  SECURITY = 'SECURITY',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export const USER_ROLES = Object.values(UserRole);

export interface UserUpdateData {
  role?: UserRole;
  isApproved?: boolean;
  name?: string;
  email?: string;
  rollNo?: string;
}

export interface UserCreateData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  rollNo?: string;
  isApproved?: boolean;
}
