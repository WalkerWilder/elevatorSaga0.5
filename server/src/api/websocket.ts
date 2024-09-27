import { Request } from "express";
import { Server, WebSocket } from "ws";
import { IncomingMessage, ServerResponse } from "http";

interface client {
  id: string;
  socket: WebSocket;
}

export class WebSocketServer {
  server: Server;
  clients: Set<client>;
  constructor(server: Server<typeof WebSocket>) {
    this.server = new Server({
      server: server as any,
    });
    this.clients = new Set<client>();
    this.server.on("connection", this.onConnection);
  }
  onConnection(socket: WebSocket, req: Request) {
    const query = req.url.split("?")[1] || req.url;
    const searchParams = new URLSearchParams(query);
    const id = searchParams.get("id") ?? "";
    this.clients.add({ id, socket });
    socket.on("message", (data:any)=>{
      console.log(`onMessage: ${data}`);
    });
  }
}

// function onError(ws: WebSocket, err: any) {
//   console.error(`onError: ${err.message}`);
// }

// function onMessage(ws: WebSocket, data: object) {
//   console.log(`onMessage: ${data}`);
//   ws.send(`received!`);
// }

// function onConnection(ws: WebSocket, req: Request) {
//   ws.on("message", (data) => onMessage(ws, data));
//   ws.on("error", (error) => onError(ws, error));
//   console.log(`onConnection`);
// }

// module.exports = (server: Server) => {
//   const wss = new Server({
//     server: server as any,
//   });

//   wss.on("connection", onConnection);

//   console.log(`App Web Socket Server is running!`);
//   return wss;
// };
