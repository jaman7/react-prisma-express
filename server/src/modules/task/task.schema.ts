import { object, string, number } from 'zod';

export const createTaskSchema = object({
  body: object({
    title: string({ required_error: 'Title is required' }),
    description: string().optional(),
    columnId: string({ required_error: 'Column ID is required' }),
    position: number().optional(),
  }),
});

export const updateTaskSchema = object({
  body: object({
    title: string().optional(),
    description: string().optional(),
  }),
});

export const assignTaskSchema = object({
  body: object({
    userId: string({ required_error: 'User ID is required' }),
  }),
});

export const updateTaskStatusSchema = object({
  body: object({
    status: string({ required_error: 'Status is required' }),
    columnId: string({ required_error: 'Column ID is required' }),
  }),
});

export const updateTaskPositionSchema = object({
  body: object({
    position: number({ required_error: 'Position is required' }),
  }),
});
