import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import WebSocket = require('ws');

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', socket => {
  socket.on('message', message => console.log(message))
})



app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});