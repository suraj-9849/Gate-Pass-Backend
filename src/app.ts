import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes.js';
import { gatePassRoutes } from './routes/gatepass.routes.js';
import { adminRoutes } from './routes/admin.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gate-pass', gatePassRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req:Request, res:Response) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;