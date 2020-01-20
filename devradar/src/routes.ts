import { Router } from 'express';
import authMiddleware from '@app/middleware/auth';

import UserController from '@app/controllers/UserController';
import DevController from '@app/controllers/DevController';
import SearchController from '@app/controllers/SearchController';

const routes = Router();

routes.get('/hello', UserController.hello);

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.post('/search', SearchController.index);

routes.use(authMiddleware);

routes.get('/loggedin', UserController.hello);

export default routes;
