import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import WebSocket = require('ws');

dotenv.config();

function onSocketPreError(e: Error) {
  console.log(e)
} 

function onSocketPostError(e: Error) {
  console.log(e)
} 

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

const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

server.on('upgrade', (req, socket, head) => {
  socket.on('error', onSocketPreError)

  //preform auth
  if (!!req.headers['BadAuth']) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return
  }

  wss.handleUpgrade(req, socket, head, (ws)=>{
    socket.removeListener('error', onSocketPreError)
    wss.emit('connection', ws, req)
  })
})

wss.on('connection', (ws,req) => {
  ws.on('error', onSocketPostError);
  ws.on('message', (msg, isBinary) => {
    wss.clients.forEach((client)=>{
      if(client.readyState === WebSocket.OPEN) {
        client.send(msg,{binary:isBinary})
      }
    })
  })
})