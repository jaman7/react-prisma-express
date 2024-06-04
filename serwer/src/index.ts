import cors from "cors";
import express, { NextFunction, Request, Response, response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const bodyParser = require("body-parser");
import prisma from "./prisma-client";
import validateEnv from "./utils/validateEnv";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import AppError from "./utils/appError";
import config from "config";

// import { auth } from "express-openid-connect";
// import {
//   createBoard,
//   deleteBoard,
//   getBoards,
//   updateBoard,
// } from "./backup/board";
// import { dragTask } from "./backup/task";
// import { getUserId, getUsers } from "./backup/users";

dotenv.config();
const app = express();

async function bootstrap() {
  // TEMPLATE ENGINE
  // app.set("view engine", "pug");
  // app.set("views", `${__dirname}/views`);

  // 1.Body Parser
  app.use(express.json({ limit: "10kb" }));

  // 2. Cookie Parser
  app.use(cookieParser());
  app.use(bodyParser.json());

  // 2. Cors
  app.use(cors());

  // 3. Logger
  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

  // ROUTES
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);

  // Testing
  app.get("/api/healthchecker", (_, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "Welcome to NodeJs with Prisma and PostgreSQL",
    });
  });

  // UNHANDLED ROUTES
  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(404, `Route ${req.originalUrl} not found`));
  });

  // GLOBAL ERROR HANDLER
  app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });

  app.listen({ port: process.env.PORT });
}

bootstrap()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// app.get("/board", async (req, res) => {
//   getBoards()
//     .then((boards) => {
//       return res.json(boards);
//     })
//     .catch((err) => {
//       res.status(400).send({ error: err.message });
//     });
// });

// app.post("/board", async (req, res) => {
//   const data = req.body;
//   createBoard(data)
//     .then((boards) => {
//       return res.json(boards);
//     })
//     .catch((err) => {
//       res.status(400).send({ error: err.message });
//     });
// });

// app.put("/board/:id", async (req, res) => {
//   const { id } = req?.params || {};
//   const data = req.body;
//   updateBoard(id, data)
//     .then((boards) => {
//       return res.json(boards);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(400).send({ error: err.message });
//     });
// });

// app.delete("/board/:id", async (req, res) => {
//   const { id } = req?.params || {};
//   deleteBoard(id)
//     .then((boards) => {
//       return res.json(boards);
//     })
//     .catch((err) => {
//       res.status(400).send({ error: err.message });
//     });
// });

// app.put("/dragtask/:id", async (req, res) => {
//   const { id } = req?.params || {};
//   const data = req.body;
//   dragTask(data)
//     .then((task) => {
//       return res.json(task);
//     })
//     .catch((err) => {
//       res.status(400).send({ error: err.message });
//     });
// });

// app.get("/users", async (req, res) => {
//   getUsers()
//     .then((users) => {
//       return res.json(users);
//     })
//     .catch((err) => {
//       res.status(400).send({ error: err.message });
//     });
// });

// app.get("/user/:id", async (req, res) => {
//   const { id } = req?.params || {};
//   getUserId(+id as number)
//     .then((user) => {
//       return res.json(user);
//     })
//     .catch((err) => {
//       res.status(400).send({ error: err.message });
//     });
// });
