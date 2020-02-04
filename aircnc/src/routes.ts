import { Router } from 'express';
import authMiddleware from '@app/middleware/auth';

import StatusController from '@app/controllers/StatusController';
import SpotsController from '@app/controllers/SpotController';
import SessionController from '@app/controllers/SessionController';
import UserController from '@app/controllers/UserController';

const routes = Router();

// ----------------- public routes ------------------------
routes.get('', StatusController.redirect);
routes.get('/status', StatusController.status);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.session);

routes.get('/spots', SpotsController.index);

// ----------------- auth routes ------------------------
routes.use(authMiddleware);

routes.get('/users', UserController.index);

routes.post('/spots', SpotsController.store);

export default routes;
