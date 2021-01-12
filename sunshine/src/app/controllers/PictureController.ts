import { Request, Response } from 'express';
import Picture from 'app/models/Picture';

import service from './../services/PictureService';

class PictureController {
  async find(req: Request, res: Response) {
    const query = req.query.query as string;

    const photo: Picture = await service.getRandom(query);
    return res.json(photo);
  }
}

export default new PictureController();
