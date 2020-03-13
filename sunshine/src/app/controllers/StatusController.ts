import { Request, Response } from 'express';
import Status from 'app/models/Status';

class StatusController {
  async status(_: Request, res: Response) {
    return res.json(<Status>{
      app: 'Sunshine - Weather Radar - API',
      time: new Date()
    });
  }
}

export default new StatusController();
