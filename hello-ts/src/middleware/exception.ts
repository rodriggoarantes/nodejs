import { Request, Response, NextFunction } from 'express';

import { logger } from '../config/logger';
import { DomainError } from '../app/commons/Errors';


const exceptionHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  const mensagem = err.message && `Erro interno :: ${err.message || 'Não Esperado'}`;
  const stacktracer = process.env.NODE_ENV === 'develop' ? err.stack || '' : '';
  const statusCode = err instanceof DomainError ? err.status : 500;

  logger.error(`step=error C=exception M=exceptionHandler msg=${mensagem} stack=${stacktracer}`);

  return res.status(statusCode).json({
    message: mensagem,
    error: typeof err === 'string' ? err : JSON.stringify(err),
    stack: stacktracer,
  });
};

export default exceptionHandler;
