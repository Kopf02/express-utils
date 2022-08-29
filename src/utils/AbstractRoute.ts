import { Router } from 'express';
import Route from '../interfaces/RouteInterface';

export abstract class AbstractRoute implements Route {
  public readonly router: Router;
  abstract readonly path: string;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  abstract initializeRoutes(): void;
}
