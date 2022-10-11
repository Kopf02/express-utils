import HttpException from './HttpException';
import { HttpError } from '../interfaces/HttpResponseInterface';
import { Config } from '../config';

class InternalServerError extends HttpException {
  private readonly error: Error;
  constructor(originalError: Error) {
    super(500, 'Internal Server Error');
    this.error = originalError;
  }
  getBody(): HttpError<Error> {
    if (Config.getConfig().get('env') === 'test')
      return { ...super.getBody(), errorDetails: this.error };
    else return super.getBody();
  }
}

export default InternalServerError;
