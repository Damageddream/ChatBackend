// import express, { Express, Request, Response } from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import WebSocket = require("ws");

// dotenv.config();

// function onSocketPreError(e: Error) {
//   console.log(e);
// }

function onSocketPostError(e: Error) {
  console.log(e);
}

// const app: Express = express();
// const port = 8000;

// const wss = new WebSocket.Server({ noServer: true });

// wss.on("connection", (socket) => {
//   socket.on("message", (message) => console.log(message));
// });

// app.use(cors());

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

// const server = app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
// });

// server.on("upgrade", (req, socket, head) => {
//   socket.on("error", onSocketPreError);

//   //preform auth
//   if (!!req.headers["BadAuth"]) {
//     socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
//     socket.destroy();
//     return;
//   }

//   wss.handleUpgrade(req, socket, head, (ws) => {
//     socket.removeListener("error", onSocketPreError);
//     wss.emit("connection", ws, req);
//   });
// });

// wss.on("connection", (ws, req) => {
//   ws.on("error", onSocketPostError);
//   ws.on("message", (msg, isBinary) => {
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(msg, { binary: isBinary });
//       }
//     });
//   });
// });
import { WebSocket } from 'ws';
const { WebSocketServer } = require('ws');
const http = require('http');

// Spinning the HTTP server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

interface Clients {
  [userId: number]: WebSocket
}

// I'm maintaining all active connections in this object
const clients: Clients = {};

// A new client connection request received
wsServer.on('connection', function(connection: WebSocket) {
  connection.on("error", onSocketPostError);
  // Generate a unique code for every user
  const userId = 1;
  console.log(`Recieved a new connection.`);

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);

  connection.on('message', function incoming(message) {
    console.log('received: %s', message); 
  });

  connection.on('close', function close() {
    console.log(`${userId} disconnected.`);
    delete clients[userId];
  });
});