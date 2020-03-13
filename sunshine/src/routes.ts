import { Router } from 'express';
import authMiddleware from './app/middleware/auth';

import StatusController from './app/controllers/StatusController';
import CountryController from './app/controllers/CountryController';

const routes = Router();

routes.get(['', '/status'], StatusController.status);

routes.get('/countries', CountryController.index);
routes.get('/countries/random', CountryController.findRandom);

routes.use(authMiddleware);

routes.get('/auth', StatusController.status);

export default routes;
