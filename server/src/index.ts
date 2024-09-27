import dotenv from "dotenv";
dotenv.config();
import { WebSocketServer } from "./api/websocket";
import app from "./api/rest";


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App Express is running on port ${port}!`);
});

new WebSocketServer(server as any)

