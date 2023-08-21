import * as express from 'express';
import * as cors from 'cors';

import errorMiddleware from './middlewares/ErrorMiddleware';
import { logger } from './utils/logger';
import { RequestHandlerParams } from 'express-serve-static-core';
import { Server } from 'http';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import { generate } from 'selfsigned';
import { CorsOptions, CorsOptionsDelegate } from 'cors';
import { Router } from 'express';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  private listener?: Server;
  private _beforeMiddlewares: RequestHandlerParams[];
  private _afterMiddlewares: RequestHandlerParams[];
  private readonly router: Router;
  private corsOptions?: CorsOptions | CorsOptionsDelegate;

  constructor(router: Router) {
    this.router = router;
    this.app = express();
    this.port = 8080;
    this.env = process.env.NODE_ENV || 'development';
  }

  /**
   * Initializes all middlewares
   * Also initializes the Http Server if not already initialized
   * If already initialized, the ssl option will be ignored
   * @param ssl
   */
  public init(ssl = false) {
    this.initializeMiddlewares();
    this.initializeRoutes(this.router);
    this.initializeErrorHandling();
    this.initializeHttpServer(ssl);
  }

  /**
   * Will in most cases be called by init()
   * @param ssl
   */
  public initializeHttpServer(ssl = false) {
    this.listener ||= ssl
      ? https.createServer(this.getSslOptions(), this.app)
      : (this.listener = http.createServer(this.app));
  }

  public listen(port?: number) {
    this.port = port || this.port;
    const listeningListener = () => {
      const isSsl = this.listener instanceof https.Server;

      logger.info('=================================');
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(isSsl ? '🔒 SSL enabled' : '🔓 SSL disabled');
      logger.info('=================================');
    };

    this.listener?.listen(this.port, listeningListener) ||
      logger.error('Server not initialized!');
  }

  public getServer() {
    return this.app;
  }

  public getHttpServer() {
    return this.listener;
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
      logger.warn('SSL certificate not found using self signed certificate');
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

    this.app.use(cors(this.corsOptions));

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

  public setCorsOptions(options: CorsOptions | CorsOptionsDelegate) {
    this.corsOptions = options;
  }

  private initializeRoutes(routes: Router) {
    this.app.use(routes);
    this.app.use(function (_req, res) {
      res.status(404).json({ error: 'Page not found' });
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
