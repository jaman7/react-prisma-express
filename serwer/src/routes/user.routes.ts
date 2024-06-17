import express from "express";
import {
  deleteUser,
  getAllUsersHandler,
  getMeHandler,
  getUser,
  setUser,
} from "../controllers/user.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { loginUserSchema } from "../schemas/user.schema";

const userRouter = express.Router();
userRouter.use(deserializeUser, requireUser);
userRouter.get("/me", getMeHandler);
userRouter.get("/", getAllUsersHandler);
userRouter.get("/:id", getUser);
userRouter.put("/:id", setUser);
userRouter.post("/", setUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
