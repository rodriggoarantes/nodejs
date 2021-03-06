import { Request, Response } from 'express';

import { parseStringToArray } from '@app/services/Utils';
import devService from '@app/services/DevService';

import Dev from '@app/models/Dev';

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

  async username(req: Request, res: Response) {
    var username = req.params.username;
    const dev: Dev = await devService.findByUsername(username);
    return res.json(dev);
  }

  async techs(req: Request, res: Response) {
    const { techs } = req.body;
    const techsArray: Array<string> = parseStringToArray(techs);

    const devs: Array<Dev> = await devService.searchByTechs(techsArray);

    return res.json(devs);
  }
}

export default new SearchController();
