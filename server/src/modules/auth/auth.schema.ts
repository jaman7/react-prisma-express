import { object, string, TypeOf, z } from 'zod';

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email address is required',
    }).email('Invalid email address'),
    password: string({
      required_error: 'Password is required',
    }).min(8, 'Invalid password'),
  }),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
