import { Request, Response } from 'express';

import cityService from './../services/CityService';
import City from './../models/City';

class CityController {
  async search(req: Request, res: Response) {
    const name = req.query.name as string;
    if (!name) {
      throw 'Filtro *name* não informado';
    } else if (name.length < 3) {
      throw 'Filtro *name* deve conter pelo menos três (3) caracteres';
    }

    const list: Array<City> = await cityService.findByName(name);

    if (list && list.length) {
      return res.status(200).json(list);
    } else {
      return res.status(404).json({ mensagem: 'Nenhum registro encontrado' });
    }
  }

  async find(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      throw 'Identificador da cidade deve ser informado';
    }

    const city: City = await cityService.findById(id);

    if (city._id) {
      return res.status(200).json(city);
    } else {
      return res.status(404).json({ mensagem: 'Nenhum registro encontrado' });
    }
  }
}

export default new CityController();
