import { Router } from 'express';
import authMiddleware from './app/middleware/auth';

import UserController from './app/controllers/UserController';
import DevController from './app/controllers/DevController';

const routes = Router();

routes.get('/hello', UserController.hello);
routes.post('/devs', DevController.store);

routes.use(authMiddleware);

routes.get('/loggedin', UserController.hello);

export default routes;
