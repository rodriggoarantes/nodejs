import { Request, Response } from 'express';

import countryService from './../services/CountryService';
import Country from './../models/Country';

class CountryController {
  async index(_: Request, res: Response) {
    const list: Array<Country> = await countryService.list();

    if (list && list.length) {
      return res.status(200).json(list);
    } else {
      return res.status(404).json({ mensagem: 'Nenhum registro encontrado' });
    }
  }

  async findRandom(_: Request, res: Response) {
    const pais: Country = await countryService.random();
    if (pais && pais._id) {
      return res.status(200).json(pais);
    } else {
      return res.status(404).json({ mensagem: 'Nenhum registro encontrado' });
    }
  }
}

export default new CountryController();
