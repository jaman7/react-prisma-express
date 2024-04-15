import fastify from "fastify";
import dotenv from "dotenv";
import { getBoards } from "./src/board";
dotenv.config();
const app = fastify();

app.get('/boards', async (req, res) => {
    getBoards().then(boards => {
        res.send(boards);
    }).catch(err => {
        res.status(500).send({error: err.message});
    })
})

app.listen({port: process.env.PORT});