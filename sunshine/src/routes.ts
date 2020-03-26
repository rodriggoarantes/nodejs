import { Router } from 'express';
import authMiddleware from '@app/middleware/auth';

import StatusController from '@app/controllers/StatusController';
import UserController from '@app/controllers/UserController';
import CountryController from '@app/controllers/CountryController';
import CityController from '@app/controllers/CityController';
import WeatherController from '@app/controllers/WeatherController';
import ForecastController from '@app/controllers/ForecastController';
import PictureController from '@app/controllers/PictureController';

const routes = Router();

routes.get(['', '/status'], StatusController.status);

routes.post('/users', UserController.create);
routes.post('/login', UserController.login);

routes.get('/countries', CountryController.index);
routes.get('/countries/random', CountryController.findRandom);
routes.get('/countries/code/:code', CountryController.findByCode);

routes.get('/cities', CityController.search);
routes.get('/cities/:id', CityController.find);

routes.get('/weathers/suggested', WeatherController.suggested);
routes.get('/weathers/cities/:id', WeatherController.findByCity);
routes.get('/forecasts/cities/:id', ForecastController.findByCity);

routes.get('/pictures', PictureController.find);

routes.use(authMiddleware);

routes.get('/auth', StatusController.status);

export default routes;
