import express, { Router, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Express } from 'express';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes.js';
import { gatePassRoutes } from './routes/gatepass.routes.js';
import { adminRoutes } from './routes/admin.routes.js';
import { securityRoutes } from './routes/security.routes.js';
import { studentRoutes } from './routes/student.routes.js';

dotenv.config();

const app: Express = express();

// Detailed CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check with detailed response
app.get('/health', (req: Request, res: Response) => {
  console.log('Health check requested from:', req.ip);

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    user: process.env.USER || 'unknown',
    requestIP: req.ip,
    headers: req.headers,
  });
});

// API routes
app.use('/api/auth', authRoutes as Router);
app.use('/api/gate-pass', gatePassRoutes as Router);
app.use('/api/admin', adminRoutes as Router);
app.use('/api/security', securityRoutes as Router);
app.use('/api/students', studentRoutes as Router);

// Error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    timestamp: new Date().toISOString(),
  });
});

const PORT: any = process.env.PORT || 3001;

// Listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started at ${new Date().toISOString()}`);
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log('Press Ctrl+C to stop');
});

export default app;
