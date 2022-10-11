import * as test from 'whatwg-url';
import { Config } from '../config';
import { IDbConfig } from '../config/modules/dbConfig';

export const getMongoConnectionString = (query: string | null = null) => {
  const config = Config.getConfig<IDbConfig>();
  return test
    .serializeURL({
      scheme: 'mongodb',
      host: config.get('db.host'),
      port: config.get('db.port'),
      password: config.get('db.password'),
      username: config.get('db.user'),
      path: config.get('db.database'),
      query: query,
      fragment: null,
    })
    .toString();
};
