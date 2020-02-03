import { Request, Response } from 'express';

import Status from '@app/models/Status';

class StatusController {
  redirect(_: Request, res: Response) {
    const urlroot = '/status';
    if (process.env.NODE_ENV !== 'develop') {
      res.redirect(`/api/${urlroot}`);
    }
    res.redirect(urlroot);
  }

  async status(_: Request, res: Response) {
    return res.json(<Status>{ app: 'AIRCNC', time: new Date() });
  }
}

export default new StatusController();
