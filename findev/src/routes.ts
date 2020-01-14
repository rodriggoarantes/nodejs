import { Router, Request, Response } from 'express';
import authMiddleware from './app/middleware/auth';

import UserController from './app/controllers/UserController';

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
  res.redirect('/hello');
});
routes.get('/hello', UserController.hello);

routes.use(authMiddleware);

routes.get('/loggedin', UserController.hello);

export default routes;
