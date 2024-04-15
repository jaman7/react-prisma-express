import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getBoards } from "./board";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/board", async (req, res) => {
  getBoards()
    .then((boards) => {
      res.send(boards);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err.message });
    });
});

app.listen({ port: 5174 });
