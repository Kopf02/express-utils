import { Schema } from 'convict';

export interface IDbConfig {
  db: {
    password: string;
    user: string;
    database: string;
    port: number;
    host: string;
  };
}

export const dbConfig = (
  db: 'mysql' | 'mongodb' | 'neo4j',
  projectDefaultName = '',
  optionalDatabaseProperties = {}
): Schema<IDbConfig> => {
  const defaultPort = {
    mysql: 3306,
    mongodb: 27017,
    neo4j: 7687,
  };

  return {
    db: {
      host: {
        doc: 'Database host name/IP',
        format: String,
        default: 'localhost',
        env: 'DB_HOST',
      },
      port: {
        doc: 'Database host port',
        format: Number,
        default: defaultPort[db],
        env: 'DB_PORT',
      },
      database: {
        doc: 'Database name',
        format: String,
        default: projectDefaultName,
        env: 'DB_DB',
      },
      user: {
        doc: 'Database username',
        format: String,
        default: projectDefaultName,
        env: 'DB_USER',
      },
      password: {
        doc: 'Database password',
        format: String,
        default: '',
        env: 'DB_PASSWD',
      },
      ...optionalDatabaseProperties,
    },
  };
};
