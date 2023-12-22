"use strict";
// import express, { Express, Request, Response } from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import WebSocket = require("ws");
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// function onSocketPreError(e: Error) {
//   console.log(e);
// }
function onSocketPostError(e) {
    console.log(e);
}
const { WebSocketServer } = require('ws');
const http = require('http');
// Spinning the HTTP server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;
server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
});
// I'm maintaining all active connections in this object
const clients = {};
// A new client connection request received
wsServer.on('connection', function (connection) {
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
//# sourceMappingURL=app.js.map