import { Schema } from 'convict';

export interface DefaultMainConfigInterface {
  port: number;
  env: string;
  loglevel: string;
  ssl: boolean;
}

export const defaultMainConfig: Schema<DefaultMainConfigInterface> = {
  loglevel: {
    doc: 'The application loglevel.',
    format: String,
    default: 'info',
    env: 'LOGLEVEL',
  },
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT',
    arg: 'port',
  },
  ssl: {
    doc: 'Enable SSL',
    format: Boolean,
    default: false,
    env: 'SSL',
    arg: 'ssl',
  },
};
