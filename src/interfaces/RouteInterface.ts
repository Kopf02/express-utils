import { Router } from 'express';

interface Route {
  readonly path: string;
  router: Router;
}

export default Route;
