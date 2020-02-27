import { Router } from 'express';

import authMiddleware from '@app/middleware/auth';
import uploadFileMiddleware from '@app/middleware/upload';

import StatusController from '@app/controllers/StatusController';
import SessionController from '@app/controllers/SessionController';
import FileController from '@app/controllers/FileController';
import UserController from '@app/controllers/UserController';
import SpotsController from '@app/controllers/SpotController';
import ProfileController from '@app/controllers/ProfileController';
import BookingController from '@app/controllers/BookingController';

const routes = Router();

// ----------------- public routes ------------------------
routes.get('', StatusController.redirect);
routes.get('/status', StatusController.status);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.session);

routes.get('/spots', SpotsController.index);
routes.post('/spots', uploadFileMiddleware, SpotsController.store);
routes.post('/spots/:id/bookings', BookingController.store);

routes.get('/profiles/spots', ProfileController.spots);

routes.post('/files', uploadFileMiddleware, FileController.store);

// ----------------- auth routes ------------------------
routes.use(authMiddleware);

routes.get('/users', UserController.index);

export default routes;
