import { LeveledLogMethod } from 'winston';
import { logger } from '../utils/logger';
import HttpException from './HttpException';

class BadRequest extends HttpException {
  constructor(error: string) {
    super(400, error);
  }

  public logLevel(): LeveledLogMethod {
    return logger.warn;
  }
}

export default BadRequest;
