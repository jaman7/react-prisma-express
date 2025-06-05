import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import prisma from './prisma-client';
import AppError from '@/utils/appError';
import projectRoutes from './modules/projects/projects.routes';
import authRouter from './modules/auth/auth.routes';
import userRouter from './modules/user/user.routes';
import boardRouter from './modules/board/board.routes';
import taskRouter from './modules/task/task.routes';
import { redisSubscriber } from './utils/redis';

// import generate from "./generate";
import { createServer } from 'http';
import { Server } from 'socket.io';
// import { redisSubscriber } from "@/utils/redis";

dotenv.config();
const app = express();

async function bootstrap() {
  // 1.Body Parser
  app.use(express.json({ limit: '10kb' }));

  // 2. Cookie Parser
  app.use(cookieParser());
  app.use(bodyParser.json());

  // 2. Cors
  app.use(cors());

  // 3. Logger
  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

  // ROUTES
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/projects', projectRoutes);
  app.use('/api/boards', boardRouter);
  app.use('/api/tasks', taskRouter);

  // Testing
  app.get('/api/healthchecker', (_, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to NodeJs with Prisma and PostgreSQL',
    });
  });

  // UNHANDLED ROUTES
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(404, `Route ${req.originalUrl} not found`));
  });

  // GLOBAL ERROR HANDLER
  app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });

  // app.listen({ port: process.env.PORT });
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

// // Mapowanie użytkowników na ich połączenia
const userSockets = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('User connected:', socket?.id);

  socket.on('register', (userId: string) => {
    userSockets.set(userId, socket.id);
  });

  socket.on('disconnect', () => {
    userSockets.forEach((value, key) => {
      if (value === socket.id) userSockets.delete(key);
    });
    console.log('User disconnected:', socket.id);
  });
});

// Subskrypcja powiadomień Redis
redisSubscriber.subscribe('notifications', (message) => {
  const notification = JSON.parse(message);

  const socketId = userSockets.get(notification.userId);
  if (socketId) {
    io.to(socketId).emit('notification', notification);
  }
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

bootstrap()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default app;
