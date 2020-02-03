import { Request, Response } from 'express';

class StatusController {
  redirect(_: Request, res: Response) {
    res.redirect('/api/status');
  }
  async status(_: Request, res: Response) {
    return res.json({ app: 'Firebase Cloud Functions - API', time: new Date(), techs: ['typescript', 'nodejs', 'firebase', 'expressjs'] });
  }
}

export default new StatusController();
