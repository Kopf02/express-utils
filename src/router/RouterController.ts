import { IRoute } from 'express';

export interface RouterController {
  initializeRoutes(router: IRoute): void;
}
