import { Router } from 'express';
import authMiddleware from './app/middleware/auth';

import StatusController from './app/controllers/StatusController';
import CountryController from './app/controllers/CountryController';
import CityController from './app/controllers/CityController';
import WeatherController from './app/controllers/WeatherController';
import ForecastController from './app/controllers/ForecastController';

const routes = Router();

routes.get(['', '/status'], StatusController.status);

routes.get('/countries', CountryController.index);
routes.get('/countries/random', CountryController.findRandom);
routes.get('/countries/code/:code', CountryController.findByCode);

routes.get('/cities', CityController.search);
routes.get('/cities/:id', CityController.find);

routes.get('/weathers/cities/:id', WeatherController.findByCity);
routes.get('/forecasts/cities/:id', ForecastController.findByCity);

routes.use(authMiddleware);

routes.get('/auth', StatusController.status);

export default routes;
