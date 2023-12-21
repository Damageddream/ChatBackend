"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const WebSocket = require("ws");
dotenv_1.default.config();
function onSocketPreError(e) {
    console.log(e);
}
function onSocketPostError(e) {
    console.log(e);
}
const app = (0, express_1.default)();
const port = 8000;
const wss = new WebSocket.Server({ noServer: true });
wss.on("connection", (socket) => {
    socket.on("message", (message) => console.log(message));
});
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
server.on("upgrade", (req, socket, head) => {
    socket.on("error", onSocketPreError);
    //preform auth
    if (!!req.headers["BadAuth"]) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener("error", onSocketPreError);
        wss.emit("connection", ws, req);
    });
});
wss.on("connection", (ws, req) => {
    ws.on("error", onSocketPostError);
    ws.on("message", (msg, isBinary) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg, { binary: isBinary });
            }
        });
    });
});
//# sourceMappingURL=app.js.map