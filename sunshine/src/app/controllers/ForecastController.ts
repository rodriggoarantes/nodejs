import { Request, Response } from 'express';

import { City } from './../models/City';

import weatherService from './../services/WeatherService';
import cityService from './../services/CityService';

class ForecastController {
  async findByCity(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw 'Identificador da cidade deve ser informado';
    }

    const city: City = await cityService.findById(id);
    if (!city || !city._id) {
      throw 'Cidade informada não encontrada';
    }

    const list = await weatherService.forecastByCity(city);

    if (list && list.length) {
      return res.status(200).json(list);
    } else {
      return res.status(404).json({ mensagem: 'Nenhum registro encontrado' });
    }
  }
}

export default new ForecastController();
