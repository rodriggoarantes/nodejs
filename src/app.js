import 'dotenv/config';

import path from 'path';
import express from 'express';
import Youch from 'youch';
import cors from 'cors';

import 'express-async-errors';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';

import routes from './routes';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // CORS
    this.server.use(cors());
    // Sentry
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    // Sentry
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'develop') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json({ message: 'Erro interno não esperado' });
    });
  }
}

export default new App().server;
