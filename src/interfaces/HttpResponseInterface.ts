import { ValidationErrorItem } from 'joi';

export interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

interface Success<T> {
  data: T;
}

export type HTTPResponse<T> = Error | Success<T>;
