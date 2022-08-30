import { LeveledLogMethod } from 'winston';
import { logger } from '../utils/logger';
import HttpException from './HttpException';

class NotFound extends HttpException {
  constructor(error: string) {
    super(404, error);
  }

  public logLevel(): LeveledLogMethod {
    return logger.verbose;
  }
}

export default NotFound;
