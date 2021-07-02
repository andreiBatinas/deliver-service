import {
  Request,
  Response,
} from 'express';

export function notFoundMiddleware(req: Request, res: Response) {
  return res.status(404).json({
    message: 'Result for the request not found'
  });
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
