import { config as loadEnv } from 'dotenv';
import convict, { Config, Format } from 'convict';
import validator from 'convict-format-with-validator';

loadEnv();
convict.addFormats(validator as { [name: string]: Format });

type AppConfigSchema = {
  PORT: number;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  SALT: string;
  UPLOAD_DIRECTORY: string;
};

const appConfig = convict<AppConfigSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000,
  },
  DB_HOST: {
    doc: 'Database server IP address',
    format: String,
    env: 'DB_HOST',
    default: 'localhost',
  },
  DB_USER: {
    doc: 'Database user',
    format: String,
    env: 'DB_USER',
    default: 'admin',
  },
  DB_PASSWORD: {
    doc: 'Database password',
    format: String,
    env: 'DB_PASSWORD',
    default: 'test',
  },
  DB_NAME: {
    doc: 'Database name',
    format: String,
    env: 'DB_NAME',
    default: 'six-cities',
  },
  SALT: {
    doc: 'Salt value for hashing',
    format: String,
    env: 'SALT',
    default: 'six-cities-dev-salt',
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for uploaded files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: 'upload',
  },
});

appConfig.validate({ allowed: 'strict' });

export type AppConfig = Config<AppConfigSchema>;
export { appConfig };
