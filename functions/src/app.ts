import 'dotenv/config';

import * as path from 'path';
import * as express from 'express';
import { Application } from 'express';
import * as cors from 'cors';
import * as mongoose from 'mongoose';

import 'express-async-errors';

import routes from './routes';

export default class App {
  public server: Application;
  public port: number = 3333;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
    this.database();
  }

  private middlewares() {
    // CORS
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
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
        return res
          .status(500)
          .json({
            message: 'Erro interno não esperado',
            error: JSON.stringify(err)
          });
      }
    );
  }

  private database() {
    //const dburl = 'mongodb://localhost:27017/gobarber';
    const dburl =
      'mongodb+srv://findev:findev@cluster0-wy7g9.gcp.mongodb.net/findev?retryWrites=true&w=majority';
    mongoose.connect(dburl, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    });
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`);
    });
  }
}
