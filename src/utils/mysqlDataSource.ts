import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Config, IDbConfig } from '../index';
import * as path from 'path';

let AppDataSource: DataSource;

const createAppDataSource = (options: Partial<DataSourceOptions>) => {
  const preConfig: DataSourceOptions = {
    type: 'mysql',
    host: Config.getConfig<IDbConfig>().get('db.host'),
    port: Config.getConfig<IDbConfig>().get('db.port'),
    username: Config.getConfig<IDbConfig>().get('db.user'),
    password: Config.getConfig<IDbConfig>().get('db.password'),
    database: Config.getConfig<IDbConfig>().get('db.database'),
    entities: [path.join('.', 'entity', '*.ts')],
  };

  Object.assign(preConfig, options);

  AppDataSource = new DataSource(preConfig);
};

const getAppDataSource = () => {
  return AppDataSource;
};

export default { createAppDataSource, getAppDataSource };
