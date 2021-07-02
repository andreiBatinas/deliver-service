import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { HttpException } from '../exceptions/HttpException';

export function notFoundMiddleware(req: Request, res: Response) {
  return res.status(404).json({
    message: 'Result for the request not found'
  });
}

export function badRequestMiddleware(
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Bad Request',
      error: (err as SyntaxError).message
    });
  }
  next();
}

export function internalErrorMiddleware(
  err: Error,
  req: Request,
  res: Response
) {
  return res.status(500).json({
    message: 'Internal error',
    error: err.message
  });
}
