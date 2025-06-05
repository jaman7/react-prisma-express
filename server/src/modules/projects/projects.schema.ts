import { object, string, boolean, TypeOf } from 'zod';

export const createProjectSchema = object({
  body: object({
    name: string({ required_error: 'Name is required' }),
    description: string().optional(),
    isActive: boolean().optional(),
  }),
});

export const updateProjectSchema = object({
  body: object({
    name: string().optional(),
    description: string().optional(),
    isActive: boolean().optional(),
  }),
});

export type CreateProjectInput = TypeOf<typeof createProjectSchema>['body'];
export type UpdateProjectInput = TypeOf<typeof updateProjectSchema>['body'];
