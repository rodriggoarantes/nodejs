import 'dotenv/config';

import * as path from 'path';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { Application } from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';

import fbConfig from './config/firebase';
import * as firebase from 'firebase-admin';

import 'express-async-errors';

import routes from './routes';

export default class App {
  public server: Application;
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
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        return res.status(500).json({
          message:
            (err.message && 'Erro interno não esperado ${err.message}') ||
            'Erro Interno',
          error: typeof err === 'string' ? err : JSON.stringify(err)
        });
      }
    );
  }

  private database() {
    firebase.initializeApp({ credential: firebase.credential.cert(fbConfig) });
  }

  public listen() {
    this.server.listen(process.env.PORT, () => {
      console.log(`App listening on the http://localhost:${process.env.PORT}`);
    });
  }
}
