import { Request, Response } from 'express';

import Status from '@app/models/Status';

class StatusController {
  async status(req: Request, res: Response) {
    const { user } = req.headers;
    return res.json(<Status>{
      app: 'Hello - Typescript - API',
      time: new Date(),
      user: user || 'none'
    });
  }
}

export default new StatusController();
