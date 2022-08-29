import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const fallbackError = { message: 'Something went wrong' };
    const errorBody = error.getBody() || fallbackError;
    error.logLevel()(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${errorBody.error}`
    );
    res.status(status).json(errorBody);
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
