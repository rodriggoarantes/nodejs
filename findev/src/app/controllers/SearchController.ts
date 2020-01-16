import { Request, Response } from 'express';

import { parseStringToArray } from './../services/Utils';
import devService from './../services/DevService';

import Dev from './../models/Dev';

class SearchController {
  async index(req: Request, res: Response) {
    const { latitude, longitude, techs } = req.body;

    const techsArray: Array<string> = parseStringToArray(techs);

    const devs: Array<Dev> = await devService.search(
      latitude,
      longitude,
      techsArray
    );

    return res.json(devs);
  }
}

export default new SearchController();
