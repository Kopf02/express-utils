import HttpException from './HttpException';
import { HttpError } from '../interfaces/HttpResponseInterface';
import { Config } from '../config';

class InternalServerError extends HttpException {
  private readonly error: Error;
  constructor(originalError: Error) {
    super(500, 'Internal Server Error');
    this.error = originalError;
  }
  getBody(): HttpError<Record<string, string>> {
    if (Config.getConfig().get('env') === 'development')
      return {
        ...super.getBody(),
        errorDetails: Object.getOwnPropertyNames(this.error).reduce(
          (prev: Record<string, string>, key) => {
            prev[key] = this.error[key as never];
            return prev;
          },
          {}
        ),
      };
    else return super.getBody();
  }
}

export default InternalServerError;
