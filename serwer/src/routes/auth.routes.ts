import express from "express";
import {
  loginUserHandler,
  logoutUserHandler,
  refreshAccessTokenHandler,
  registerUserHandler,
} from "../controllers/auth.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { loginUserSchema, registerUserSchema } from "../schemas/user.schema";

const authRouter = express.Router();
authRouter.post("/register", validate(registerUserSchema), registerUserHandler);
authRouter.post("/login", validate(loginUserSchema), loginUserHandler);
authRouter.post("/refresh", refreshAccessTokenHandler);
authRouter.get("/logout", deserializeUser, requireUser, logoutUserHandler);

export default authRouter;
