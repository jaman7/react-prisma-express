import express from 'express';
import { validate } from '@/middleware/validate';
import { deserializeUser } from '@/middleware/deserializeUser';
import { requireUser } from '@/middleware/requireUser';
import {
  assignTaskHandler,
  createTaskHandler,
  deleteTaskHandler,
  getTaskHandler,
  getTaskHistoryHandler,
  getTasksHandler,
  updateTaskHandler,
  updateTaskPositionHandler,
  updateTaskStatusHandler,
} from './task.controller';
import { assignTaskSchema, createTaskSchema, updateTaskPositionSchema, updateTaskSchema, updateTaskStatusSchema } from './task.schema';

const taskRouter = express.Router();

taskRouter.use(deserializeUser, requireUser);
taskRouter.get('/', getTasksHandler);
taskRouter.get('/:id', getTaskHandler);
taskRouter.post('/', validate(createTaskSchema), createTaskHandler);
taskRouter.put('/:id', validate(updateTaskSchema), updateTaskHandler);
taskRouter.delete('/:id', deleteTaskHandler);

// Dodatkowe funkcjonalności
taskRouter.post('/:id/assign', validate(assignTaskSchema), assignTaskHandler);
taskRouter.patch('/:id/status', validate(updateTaskStatusSchema), updateTaskStatusHandler);
taskRouter.patch('/:id/position', validate(updateTaskPositionSchema), updateTaskPositionHandler);
taskRouter.get('/:id/history', getTaskHistoryHandler);

export default taskRouter;
