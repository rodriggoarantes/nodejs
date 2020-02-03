import { Request, Response } from 'express';
import { formatISO } from 'date-fns';

class StatusController {
  async status(_: Request, res: Response) {
    return res.json({ status: 'OK', time: formatISO(new Date()) });
  }
}

export default new StatusController();
