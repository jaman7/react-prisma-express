import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import {
  assignUsersToBoard,
  deleteBoard,
  getAllBoardsHandler,
  getBoard,
  setBoard,
} from "../controllers/board.controller";

const boardRouter = express.Router();

boardRouter.use(deserializeUser, requireUser);
boardRouter.get("/boards", getAllBoardsHandler);
boardRouter.get("/boards/:id", getBoard);
boardRouter.put("/boards/:id", setBoard);
boardRouter.post("/boards", setBoard);
boardRouter.delete("/boards/:id", deleteBoard);
boardRouter.put("/boards/:boardId/users", assignUsersToBoard);

export default boardRouter;
