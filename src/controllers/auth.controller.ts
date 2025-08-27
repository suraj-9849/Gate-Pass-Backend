import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      const result = await authService.registerUser({
        email,
        password,
        name,
        role,
      });

      res.status(201).json({
        message: 'User registered successfully',
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          isApproved: result.user.isApproved,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser(email, password);

      res.json({
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          isApproved: result.user.isApproved,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const authController = new AuthController();
