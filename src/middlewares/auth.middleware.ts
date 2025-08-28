import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { UserPayload, RequestWithUser } from '../types/index.js';

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('Auth Middleware - Headers:', req.headers.authorization);

    const token = req.headers.authorization?.split(' ')[1];
    console.log('Extracted Token:', token ? 'Token exists' : 'No token');

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    console.log('Token decoded successfully:', decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const roleMiddleware = (roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    console.log('Role Middleware - User:', req.user);
    console.log('Required roles:', roles);

    if (!req.user) {
      console.log('No user in request');
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      console.log('Role not authorized:', req.user.role);
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    console.log('Role authorized:', req.user.role);
    next();
  };
};
