import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/userRoutes.js';
import questionnaireRoutes from './routes/questionnaireRoutes.js';
import routineRoutes from './routes/routineRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { scheduleRoutineReminders } from './utils/notifications.js';
import { requestLogger, queryLogger } from './utils/logger.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4000", "https://dalal.lewibelayneh.com"], // Frontend's URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies if needed
}));
app.use(express.json());
app.use(requestLogger);

// Set up Prisma query logging
prisma.$on('query', queryLogger);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set up routine reminder scheduler
const scheduleReminders = async () => {
  try {
    await scheduleRoutineReminders();
  } catch (error) {
    console.error('Error scheduling reminders:', error);
  }
};

// Schedule reminders every day at 8 AM
setInterval(scheduleReminders, 24 * 60 * 60 * 1000);
// Initial run
// scheduleReminders();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { app, prisma }; 