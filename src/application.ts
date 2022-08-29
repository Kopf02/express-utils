import * as express from 'express';
import * as cors from 'cors';

import Route from './interfaces/RouteInterface';
import errorMiddleware from './middlewares/ErrorMiddleware';
import { logger } from './utils/logger';
import { RequestHandlerParams } from 'express-serve-static-core';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  private _beforeMiddlewares: RequestHandlerParams[];
  private _afterMiddlewares: RequestHandlerParams[];
  private readonly routes: Route[];

  constructor(...routes: Route[]) {
    this.routes = routes;
    this.app = express();
    this.port = 8080;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeErrorHandling();
  }

  public init() {
    this.initializeMiddlewares();
    this.initializeRoutes(this.routes);
  }

  public listen(port?: number) {
    this.port = port || this.port;
    this.app.listen(this.port, () => {
      logger.info('=================================');
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info('=================================');
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    logger.verbose('Initializing middlewares...');
    if (this._beforeMiddlewares) this.app.use(...this._beforeMiddlewares);

    this.app.disable('x-powered-by');

    this.app.use(express.json());

    this.app.use(cors());

    this.app.use(express.urlencoded({ extended: true }));

    if (this._afterMiddlewares) this.app.use(...this._afterMiddlewares);

    //this.app.use(new MaintenanceMiddleware().ExpressMiddleWare);
    logger.verbose('Successfully initialized middlewares!');
  }

  public beforeMiddlewares(...middlewares: RequestHandlerParams[]) {
    this._beforeMiddlewares = middlewares;
  }

  public afterMiddlewares(...middlewares: RequestHandlerParams[]) {
    this._afterMiddlewares = middlewares;
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      logger.verbose('Initializing Route ' + route.path);
      this.app.use(route.path, route.router);
    });
    this.app.use(function (_req, res) {
      res.status(404).json({ error: 'Page not found' });
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
