import { Request, Response } from "express";
import { RouteBuilder } from "./routeBuilder";
import { route } from "./index";

export class GameRoutes extends RouteBuilder {
  routes: route[] = [
    {
      method: "POST",
      path: "update",
      action: (request: Request, response: Response) => {
        console.log("gotHere");
      },
    },
  ];
	constructor() {
		super();
	}
}
