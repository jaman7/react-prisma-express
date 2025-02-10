import { deserializeUser } from '@/middleware/deserializeUser';
import { requireUser } from '@/middleware/requireUser';
import { validate } from '@/middleware/validate';
import express from 'express';
import { createUserSchema, updateActiveBoardIdSchema, updatePasswordSchema, updateUserSchema } from './user.schema';
import {
  changePasswordHandler,
  createUserHandler,
  deleteUserHandler,
  getMeHandler,
  getUserDictionaryHandler,
  getUserHandler,
  getUsersHandler,
  updateActiveBoardIdHandler,
  updateMeHandler,
  updateUserHandler,
} from './user.controller';

const userRouter = express.Router();

// Middleware dla zalogowanych użytkowników
userRouter.use(deserializeUser, requireUser);

// User dictionary
userRouter.get('/dictionary', getUserDictionaryHandler);

// Dla zalogowanego użytkownika
userRouter.patch('/me/activeBoardId', validate(updateActiveBoardIdSchema), updateActiveBoardIdHandler);
userRouter.patch('/me/password', validate(updatePasswordSchema), changePasswordHandler);
userRouter.get('/me', getMeHandler);
userRouter.put('/me', validate(updateUserSchema), updateMeHandler);

// Lista użytkowników (dla ADMIN)
userRouter.get('/', getUsersHandler);
userRouter.get('/:id', getUserHandler);
userRouter.post('/', validate(createUserSchema), createUserHandler);
userRouter.put('/:id', validate(updateUserSchema), updateUserHandler);
userRouter.delete('/:id', deleteUserHandler);

export default userRouter;
