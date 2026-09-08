import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 2. Enable CORS using environment variable for the frontend origin
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// 3. Enable JSON request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Connect routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

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
