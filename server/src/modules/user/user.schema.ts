import { object, string, TypeOf, z } from 'zod';

enum RoleEnumType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  OWNER = 'OWNER',
  DEVELOPER = 'DEVELOPER',
  TESTER = 'TESTER',
}

export const updatePasswordSchema = object({
  body: object({
    oldPassword: string({
      required_error: 'Old password is required',
    }),
    newPassword: string({
      required_error: 'New password is required',
    })
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be less than 32 characters'),
  }),
});

export const updateUserSchema = object({
  body: object({
    name: string().optional(),
    email: string().email('Invalid email').optional(), // Kolejność: najpierw walidacja, potem opcjonalność
    role: z.optional(z.nativeEnum(RoleEnumType)),
  }),
});

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    email: string({
      required_error: 'Email address is required',
    }).email('Invalid email address'),
    password: string({
      required_error: 'Password is required',
    })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({
      required_error: 'Please confirm your password',
    }),
    role: z.optional(z.nativeEnum(RoleEnumType)),
  }),
});

export const updateActiveProjectIdSchema = object({
  body: object({
    activeProjectId: string({ required_error: 'activeProjectId is required' }),
  }),
});

export type RegisterUserInput = Omit<TypeOf<typeof createUserSchema>['body'], 'passwordConfirm'>;

export type UpdateUserInput = TypeOf<typeof updateUserSchema>['body'];
