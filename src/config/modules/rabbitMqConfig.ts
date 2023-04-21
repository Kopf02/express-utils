import { Schema } from 'convict';

export interface IRabbitMqConfig {
  rabbitmq: {
    host: string;
    port: string;
  };
}

export const rabbitMqConfig: Schema<IRabbitMqConfig> = {
  rabbitmq: {
    host: {
      doc: 'The HOST or IP address rabbitmq should connect to',
      format: String,
      default: '127.0.0.1',
      env: 'RABBIT_HOST',
    },
    port: {
      doc: 'The Port rabbitmq should connect to',
      format: 'port',
      default: '5672',
      env: 'RABBIT_PORT',
    },
  },
};
