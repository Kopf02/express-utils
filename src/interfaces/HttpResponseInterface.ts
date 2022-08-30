import { ValidationErrorItem } from 'joi';

export interface HttpError {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

export interface HttpSuccess<T> {
  data: T;
}

export type HTTPResponse<T> = HttpError | HttpSuccess<T>;
