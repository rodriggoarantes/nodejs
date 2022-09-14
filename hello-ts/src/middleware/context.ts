import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

import { RequestContext } from '../config/request.context';

export default async (req: Request, res: Response, next: NextFunction) => {
  let tenantid = req.headers['tenantid'];

  if (!tenantid) {
      tenantid = 'local';
  }

    const reqid = uuid();

    const context = RequestContext.instance();

    const params = new Map<string, any>();
    params.set('reqid', reqid);
    params.set('tenantid', tenantid);

    context.bootRun(params, next);
};
