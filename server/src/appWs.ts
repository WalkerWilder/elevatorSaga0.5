import { Request } from "express";
import { Server, WebSocket } from "ws";

function onError(ws: WebSocket, err: any) {
  console.error(`onError: ${err.message}`);
}

function onMessage(ws: WebSocket, data: object) {
  console.log(`onMessage: ${data}`);
  ws.send(`reeived!`);
}

function onConnection(ws: WebSocket, req: Request) {
  ws.on("message", (data) => onMessage(ws, data));
  ws.on("error", (error) => onError(ws, error));
  console.log(`onConnection`);
}

module.exports = (server: Server) => {
  const wss = new Server({
    server: server as any,
  });

  wss.on("connection", onConnection);

  console.log(`App Web Socket Server is running!`);
  return wss;
};
