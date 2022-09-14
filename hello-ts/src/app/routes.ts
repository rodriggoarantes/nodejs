import { Router } from 'express';
import authMiddleware from '../middleware/auth';

import StatusController from './controllers/StatusController';

const routes = Router();

// --- public ---
routes.get(['', '/', '/status'], StatusController.status);
// -------------

//-------
routes.use(authMiddleware);
//-------

// --- autenticates ---
routes.get('/auth', StatusController.status);
// -------------

export default routes;
