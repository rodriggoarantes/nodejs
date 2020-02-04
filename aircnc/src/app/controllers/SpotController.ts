import { Request, Response } from 'express';
import spotService from '@app/services/SpotService';

import Spot from '@app/models/Spot';

class SpotController {
  async index(_: Request, res: Response) {
    const list: Array<Spot> = await spotService.list();
    return res.status(200).json(list);
  }

  async store(req: Request, res: Response) {
    const { name } = req.body;
    return res.status(200).json({ name });
  }
}

export default new SpotController();
