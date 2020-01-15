import 'dotenv/config';

import * as path from 'path';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { Application } from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from 'morgan'; // log requests to the console
import * as compression from 'compression';

import fbConfig from './config/firebase';
import * as firebase from 'firebase-admin';

import 'express-async-errors';

import routes from './routes';
import admin = require('firebase-admin');

export default class App {
  public server: Application;
  private port: number = 3333;

  constructor() {
    this.server = express();

    this.config();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
    this.database();
  }

  private config() {
    dotenv.config();
    process.env.NODE_ENV = process.env.NODE_ENV || 'develop';
    process.env.PORT = process.env.PORT || String(this.port);
  }

  private middlewares() {
    // CORS
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(helmet());

    console.log(`nodeenv::: ${process.env.NODE_ENV}`);

    if (process.env.NODE_ENV === 'develop') {
      this.server.use(morgan('dev')); // log every request to the console
    } else {
      this.server.use(compression());
    }
  }

  private routes() {
    this.server.use(routes);
  }

  private exceptionHandler() {
    this.server.use(
      async (
        err: express.ErrorRequestHandler,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        return res.status(500).json({
          message: 'Erro interno não esperado',
          error: JSON.stringify(err)
        });
      }
    );
  }

  private database() {
    firebase.initializeApp({ credential: admin.credential.cert(fbConfig) });
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`);
    });
  }
}
