import { config as loadEnv } from 'dotenv';
import convict, { Config, Format } from 'convict';
import validator from 'convict-format-with-validator';

loadEnv();
convict.addFormats(validator as { [name: string]: Format });

type AppConfigSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
};

const appConfig = convict<AppConfigSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: null,
  },
  DB_HOST: {
    doc: 'Database server IP address',
    format: String,
    env: 'DB_HOST',
    default: null,
  },
  SALT: {
    doc: 'Salt value for hashing',
    format: String,
    env: 'SALT',
    default: null,
  },
});

appConfig.validate({ allowed: 'strict' });

export type AppConfig = Config<AppConfigSchema>;
export { appConfig };
