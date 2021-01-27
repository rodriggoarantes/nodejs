import { Request, Response } from 'express';

import cityPreferenceService from '../services/CityPreferenceService';
import weatherService from '../services/WeatherService';

import City from '../models/City';
import Weather from '../models/Weather';

class PreferenceController {
  async cities(req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) {
      throw 'Identificador de usuario deve ser informado';
    }

    const city: City[] = await cityPreferenceService.findByUser(userId);

    if (city && city.length) {
      return res.status(200).json(city);
    } else {
      return res.status(404).json({ mensagem: 'Nenhum registro encontrado' });
    }
  }

  async weathers(req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) {
      throw 'Identificador de usuario deve ser informado';
    }

    const cities: City[] = await cityPreferenceService.findByUser(userId);
    let weathers: Array<Weather> = [];

    if (cities && cities.length) {
      const promisses = cities.map(async city => {
        const cityWeather = await weatherService.weatherByCity(city);
        weathers.push(cityWeather);
      });

      await Promise.all(promisses);
    }

    if (weathers && weathers.length) {
      return res.status(200).json(weathers);
    } else {
      return res.status(404).json({ mensagem: 'Nenhum registro encontrado' });
    }
  }

  async store(req: Request, res: Response) {
    const { user, city } = req.params;
    if (!user || !city) {
      throw 'Identificador de usuario e cidade deve ser informado';
    }

    await cityPreferenceService.store(city, user);

    return res.status(200).json({ mensagem: 'Armazenado com sucesso' });
  }

  async remove(req: Request, res: Response) {
    const { user, city } = req.params;
    if (!user || !city) {
      throw 'Identificador de usuario e cidade deve ser informado';
    }

    await cityPreferenceService.remove(city, user);

    return res.status(200).json({ mensagem: 'Removido com sucesso' });
  }
}

export default new PreferenceController();
