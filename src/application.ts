import * as express from 'express';
import * as cors from 'cors';

import Route from './interfaces/RouteInterface';
import errorMiddleware from './middlewares/ErrorMiddleware';
import { logger } from './utils/logger';
import { RequestHandlerParams } from 'express-serve-static-core';
import { Server } from 'http';
import * as https from 'https';
import * as fs from 'fs';
import { generate } from 'selfsigned';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  private listener?: Server;
  private _beforeMiddlewares: RequestHandlerParams[];
  private _afterMiddlewares: RequestHandlerParams[];
  private readonly routes: Route[];

  constructor(...routes: Route[]) {
    this.routes = routes;
    this.app = express();
    this.port = 8080;
    this.env = process.env.NODE_ENV || 'development';
  }

  public init() {
    this.initializeMiddlewares();
    this.initializeRoutes(this.routes);
    this.initializeErrorHandling();
  }

  public listen(port?: number, ssl = false) {
    this.port = port || this.port;
    const listeningListener = () => {
      logger.info('=================================');
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(ssl ? '🔒 SSL enabled' : '🔓 SSL disabled');
      logger.info('=================================');
    };

    this.listener = ssl
      ? https
          .createServer(this.getSslOptions(), this.app)
          .listen(this.port, listeningListener)
      : this.app.listen(this.port, listeningListener);
  }

  public getServer() {
    return this.app;
  }

  public close() {
    this.listener?.close();
  }

  private getSslOptions() {
    let options: { key: Buffer | string; cert: Buffer | string };
    try {
      options = {
        key: fs.readFileSync('./certs/key.pem'),
        cert: fs.readFileSync('./certs/cert.pem'),
      };
    } catch (e) {
      logger.warning('SSL certificate not found using self signed certificate');
      const pems = generate(undefined, { days: 365, keySize: 4096 });
      options = {
        key: pems.private,
        cert: pems.cert,
      };
    }

    return options;
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
