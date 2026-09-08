import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import projectRoutes from './routes/project.routes';
import certificateRoutes from './routes/certificate.routes';
import experienceRoutes from './routes/experience.routes';
import educationRoutes from './routes/education.routes';
import skillRoutes from './routes/skill.routes';
import socialLinkRoutes from './routes/socialLink.routes';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = Array.from(
  new Set([
    FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ])
);

// 2. Enable CORS using environment variable and local dev origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Enable JSON request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Connect routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/social-links', socialLinkRoutes);

// 5. JSON 404 response for unknown API routes
app.use(notFoundHandler);

// 6. Centralized error handling middleware
app.use(errorHandler);

// 7 & 8. Start server and log the server startup URL
const server = app.listen(PORT, () => {
  console.log(`Portfolio API server is running on http://localhost:${PORT}`);
});

export { app, server };
export default app;
