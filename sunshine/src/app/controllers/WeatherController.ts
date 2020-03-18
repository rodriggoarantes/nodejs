import { Request, Response } from 'express';

import { City } from './../models/City';
import apiService from './../services/WeatherApiService';
import cityService from './../services/CityService';

class WeatherController {
  async findByCity(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw 'Identificador da cidade deve ser informado';
    }

    const city: City = await cityService.findById(id);
    const weather = await apiService.getWeather(city.name);

    if (weather) {
      return res.status(200).json(weather);
    } else {
      return res.status(404).json({ mensagem: 'Nenhum registro encontrado' });
    }
  }
}

export default new WeatherController();
