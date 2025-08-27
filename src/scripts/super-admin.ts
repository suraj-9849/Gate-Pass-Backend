import dotenv from 'dotenv';
import { authService } from '../services/auth.service.js';

dotenv.config();

async function createSuperAdmin() {
  try {
    const result = await authService.createSuperAdmin(
      'admin@gatepass.com',
      'SuperSecurePassword123!',
      'Super Admin'
    );
    console.log('Super Admin created successfully:', result.user);
  } catch (error) {
    console.error('Error creating Super Admin:', error);
  }
  process.exit(0);
}

createSuperAdmin();