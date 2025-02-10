import express from 'express';
import { validate } from '@/middleware/validate';
import { createBoardSchema, updateBoardSchema } from './board.schema';
import { deserializeUser } from '@/middleware/deserializeUser';
import { requireUser } from '@/middleware/requireUser';
import { createBoardHandler, deleteBoardHandler, getBoardHandler, getBoardsByUserHandler, updateBoardHandler } from './board.controller';

const boardRouter = express.Router();

boardRouter.use(deserializeUser, requireUser);
boardRouter.get('/dictionary/user/:userId', getBoardsByUserHandler);
boardRouter.get('/:id', getBoardHandler);
boardRouter.post('/', validate(createBoardSchema), createBoardHandler);
boardRouter.put('/:id', validate(updateBoardSchema), updateBoardHandler);
boardRouter.delete('/:id', deleteBoardHandler);

export default boardRouter;
