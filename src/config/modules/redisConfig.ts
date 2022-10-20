import { Schema } from 'convict';

export interface IRedisConfig {
  host: string;
  port: string;
  password?: string;
  dbIndex?: number;
}

export const redisConfig: Schema<IRedisConfig> = {
  host: {
    doc: 'The Host or IP address redis should connect to',
    format: String,
    default: '127.0.0.1',
    env: 'REDIS_HOST',
  },
  port: {
    doc: 'The Port redis should connect to',
    format: 'port',
    default: '6379',
    env: 'REDIS_PORT',
  },
  password: {
    doc: 'The Password Redis should use connect to',
    format: String,
    default: '127.0.0.1',
    env: 'REDIS_PASSWORD',
  },
  dbIndex: {
    doc: 'The Index Redis should use',
    format: Number,
    default: 0,
    env: 'REDIS_INDEX',
  },
};
