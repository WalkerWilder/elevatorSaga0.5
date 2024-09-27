import { Request, Response } from "express";
import { GameRoutes } from "./game";

export interface route {
  method: "GET" | "POST";
  path: string;
  action: (request: Request, response: Response) => void;
}

export class Routes {
  routes: route[];
  constructor() {
    this.routes = [];

    const gameRoutes = new GameRoutes();
    this.routes.push(...gameRoutes.list("game"));
  }
  list() {
    return this.routes;
  }
}
