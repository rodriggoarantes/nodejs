import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import helmet from 'helmet';
import compression from 'compression';

import exceptionHandler from './middleware/exception';
import contextMiddleware from './middleware/context';

import { RequestContext } from './config/request.context';
import { logger } from './config/logger';

import routes from './app/routes';

export default class App {
  public server: express.Express;
  public port: number = 3333;

  constructor() {
    this.server = express();

    this.config();
    this.database();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  private config() {
    dotenv.config();
    RequestContext.instance();
    process.env.NODE_ENV = process.env.NODE_ENV || 'develop';
    process.env.PORT = process.env.PORT || String(this.port);
  }

  private middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(helmet());

    if (process.env.NODE_ENV != 'develop') {
      this.server.use(compression());
      this.server.use(pinoHttp({ logger }));
    }

    this.server.use(contextMiddleware);
  }

  private routes() {
    this.server.use(routes);
  }

  private exceptionHandler() {
    this.server.use(exceptionHandler);
  }

  private database() {}

  public listen() {
    this.server.listen(process.env.PORT, () => {
      logger.info(`step=start C=App M=listen msg=App listening on the http://localhost:${process.env.PORT}`);
    });
  }
}
