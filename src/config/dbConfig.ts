import { Schema } from 'convict';

export interface DbConfigInterface {
  db: {
    password: string;
    user: string;
    database: string;
    port: number;
    host: string;
  };
}

export const dbConfig = (
  db: 'mysql' | 'mongodb',
  projectDefaultName = '',
  optionalDatabaseProperties = {}
): Schema<DbConfigInterface> => {
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
        default: db === 'mysql' ? 3306 : 27017,
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
