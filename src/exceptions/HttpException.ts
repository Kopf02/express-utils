import { Error } from '../interfaces/HttpResponseInterface';
import { LeveledLogMethod } from 'winston';
import { logger } from '../utils/logger';

class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }

  getBody(): Error {
    return { error: this.message };
  }

  logLevel(): LeveledLogMethod {
    return logger.error;
  }
}

export default HttpException;
