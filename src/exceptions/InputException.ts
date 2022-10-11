import { ValidationErrorItem } from 'joi';
import { HttpError } from '../interfaces/HttpResponseInterface';
import BadRequest from './BadRequest';

class InputException extends BadRequest {
  private readonly errorDetails: ValidationErrorItem[];

  constructor(errorDetails: ValidationErrorItem[]) {
    super('Bad Request');
    this.errorDetails = errorDetails;
  }

  public getBody(): HttpError<ValidationErrorItem[]> {
    return { ...super.getBody(), errorDetails: this.errorDetails };
  }
}

export default InputException;
