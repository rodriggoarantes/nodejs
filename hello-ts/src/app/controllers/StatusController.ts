import { Request, Response } from 'express';

import { logger } from '@config/logger';

import Status from '@app/domain/status/Status';

class StatusController {

  async status(req: Request, res: Response) {
    logger.debug('step=status C=StatusController M=status');

    const { user } = req.headers;
    return res.json(<Status>{
      app: 'Hello - Typescript - API',
      time: new Date(),
      user: user || 'none'
    });
  }
}

export default new StatusController();
