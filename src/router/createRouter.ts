import { Router } from 'express';
import { RouteList } from './RouteInterface';

interface RouterSettings {
  routes: RouteList;
}

export const createRouter = ({ routes }: RouterSettings): Router => {
  const router = Router({ mergeParams: true });
  routes.forEach((route) => {
    route.controller?.initializeRoutes(router.route(route.path));
    if (route.children) {
      router.use(route.path, createRouter({ routes: route.children }));
    }
  });
  return router;
};
