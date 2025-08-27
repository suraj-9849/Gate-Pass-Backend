// Common types for the backend
export interface UserPayload {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'TEACHER' | 'STUDENT' | 'SECURITY';
}

export interface RequestWithUser extends Request {
  user?: UserPayload;
}
