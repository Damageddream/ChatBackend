import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app: Express = express();
const server = http.createServer(app)
const port = process.env.PORT;

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});