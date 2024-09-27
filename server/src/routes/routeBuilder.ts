import { route } from "./index";

export class RouteBuilder {
  routes: route[] = [];
  list(root: string) {
    const cleanRoot = root.replace(/(^\/+|\/+$)/g, "");
    return this.routes.map((route) => {
      const cleanPath = route.path.replace(/(^\/+|\/+$)/g, "");
      route.path = `/${cleanRoot}/${cleanPath}`;
      return route;
    });
  }
}
