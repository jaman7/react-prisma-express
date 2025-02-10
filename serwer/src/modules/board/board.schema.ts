import { object, string } from 'zod';

export const createBoardSchema = object({
  body: object({
    name: string({
      required_error: 'Board name is required',
    }),
    projectId: string({
      required_error: 'Project ID is required',
    }),
  }),
});

export const updateBoardSchema = object({
  body: object({
    name: string().optional(),
  }),
});
