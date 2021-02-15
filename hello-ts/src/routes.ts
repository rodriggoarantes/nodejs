import { Router } from 'express';
import authMiddleware from './app/middleware/auth';

import StatusController from './app/controllers/StatusController';

const routes = Router();

routes.get(['', '/', '/status'], StatusController.status);

routes.use(authMiddleware);

routes.get('/auth', StatusController.status);

export default routes;
