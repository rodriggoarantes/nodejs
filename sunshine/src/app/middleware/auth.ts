import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import authConfig from '@config/auth';

export default async (req: Request, res: Response, next: NextFunction) => {
  const autHeader = req.headers.authorization;

  if (!autHeader) {
    return res.status(401).json({ code: 401, message: 'Token not provided' });
  }

  const [, token] = autHeader.split(' ');
  try {
    const decoded: any = jwt.verify(token, authConfig.secret);
    req.params['userId'] = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: 'Token invalid',
      detailedMessage: error
    });
  }
};
