export interface HttpError<T = any> {
  error: string;
  errorDetails?: T;
}

export interface HttpSuccess<T> {
  data: T;
}

export type HTTPResponse<T, E = any> = HttpError<E> | HttpSuccess<T>;
