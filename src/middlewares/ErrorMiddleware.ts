import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { HttpError } from '../interfaces/HttpResponseInterface';
import InternalServerError from '../exceptions/InternalServerError';
import { logger } from '../utils/logger';

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let status: number;
  let errorBody: HttpError;
  try {
    status = error.status || 500;
    errorBody = error.getBody();
    error.logLevel()(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${errorBody.error}`
    );
  } catch (err) {
    error = new InternalServerError(error || err);
    status = error.status;
    errorBody = error.getBody();
    logger.error(
      `[${req.method}] ${req.path} >> Fatal Error:: ${status}, Message:: ${errorBody.error}`
    );
  }

  res.status(status).json(errorBody);
};

export default errorMiddleware;
