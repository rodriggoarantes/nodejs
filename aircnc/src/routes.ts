import { Router } from 'express';
import * as multer from 'multer';

import authMiddleware from '@app/middleware/auth';

import StatusController from '@app/controllers/StatusController';
import SpotsController from '@app/controllers/SpotController';
import SessionController from '@app/controllers/SessionController';
import UserController from '@app/controllers/UserController';
import FileController from '@app/controllers/FileController';
import ProfileController from '@app/controllers/ProfileController';

import multerConfig from './config/multer';

const routes = Router();
const upload = multer(multerConfig);

// ----------------- public routes ------------------------
routes.get('', StatusController.redirect);
routes.get('/status', StatusController.status);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.session);

routes.get('/spots', SpotsController.index);
routes.post('/spots', upload.single('thumbnail'), SpotsController.store);

routes.get('/profiles/spots', ProfileController.spots);

routes.post('/files', upload.single('file'), FileController.store);

// ----------------- auth routes ------------------------
routes.use(authMiddleware);

routes.get('/users', UserController.index);

routes.post('/spots', SpotsController.store);

export default routes;
