import { Request, Response } from 'express';

import City from 'app/models/City';
import Weather from 'app/models/Weather';

import weatherService from './../services/WeatherService';
import cityService from './../services/CityService';

class WeatherController {
  async findByCity(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw 'Identificador da cidade deve ser informado';
    }

    const city: City = await cityService.findById(id);
    if (!city || !city._id) {
      throw 'Cidade informada não encontrada';
    }

    const weather = await weatherService.weatherByCity(city);

    if (weather) {
      return res.status(200).json(weather);
    } else {
      return res.status(404).json({ mensagem: 'Nenhum registro encontrado' });
    }
  }

  async suggested(_: Request, res: Response) {
    const weather: Weather = await weatherService.weatherSuggested();
    if (weather) {
      return res.status(200).json(weather);
    } else {
      return res.status(404).json({ mensagem: 'Nenhum registro encontrado' });
    }
  }
}

export default new WeatherController();
