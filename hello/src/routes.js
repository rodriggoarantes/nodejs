import Router from 'express';
import authMiddleware from './app/middleware/auth';

import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/hello', UserController.hello);

routes.use(authMiddleware);

routes.get('/loggedin', UserController.hello);

export default routes;
