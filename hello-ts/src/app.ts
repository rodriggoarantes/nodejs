import 'dotenv/config';

import dotenv from 'dotenv';
import express, {Application} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

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
    this.server.use(helmet());

    if (process.env.NODE_ENV === 'develop') {
      this.server.use(morgan('dev'));
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
        const mensagem = err.message && `Erro interno :: ${err.message || 'Não Esperado'}`;
        const stacktracer = err.stack || '';
        console.log(`${mensagem} | ${stacktracer}`);
        return res.status(500).json({
          message: mensagem,
          error: typeof err === 'string' ? err : JSON.stringify(err),
          stack: stacktracer
        });
      }
    );
  }

  private database() {}

  public listen() {
    this.server.listen(process.env.PORT, () => {
      console.log(`App listening on the http://localhost:${process.env.PORT}`);
    });
  }
}
