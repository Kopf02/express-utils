import { Schema } from 'convict';

export interface ICorsConfig {
  cors: {
    origin: string[];
  };
}

export const corsConfig: Schema<ICorsConfig> = {
  cors: {
    origin: {
      doc: 'The origin(s) to allow',
      format: Array,
      default: ['*'],
      env: 'CORS_ORIGIN',
    },
  },
};
