import { Router, Request, Response } from 'express';
import authMiddleware from '@app/middleware/auth';

import UserController from '@app/controllers/UserController';
import DevController from '@app/controllers/DevController';
import SearchController from '@app/controllers/SearchController';
import StatusController from '@app/controllers/StatusController';

const routes = Router();

routes.get('', (_: Request, res: Response) => {
  res.redirect('/status');
});
routes.get('/status', StatusController.status);

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.post('/search', SearchController.index);

routes.use(authMiddleware);

routes.get('/user', UserController.index);

export default routes;
