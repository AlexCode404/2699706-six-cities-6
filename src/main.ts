import 'reflect-metadata';
import { container } from './shared/container/container.js';
import { Component } from './shared/container/container.types.js';
import { Application } from './application/application.js';
import type { AppConfig } from './shared/config/config.js';
import type { DatabaseClient } from './shared/libs/database/database.interface.js';

function getMongoUri(
  host: string,
  user?: string,
  password?: string,
  dbName?: string
): string {
  if (host.startsWith('mongodb://') || host.startsWith('mongodb+srv://')) {
    return host;
  }

  const dbUser = user?.trim();
  const dbPassword = password?.trim();

  if (dbUser && dbPassword && dbName) {
    return `mongodb://${dbUser}:${dbPassword}@${host}/${dbName}?authSource=admin`;
  }

  if (dbName) {
    return `mongodb://${host}/${dbName}`;
  }

  return `mongodb://${host}`;
}

async function bootstrap() {
  const config = container.get<AppConfig>(Component.Config);
  const databaseClient = container.get<DatabaseClient>(Component.DatabaseClient);

  const uri = getMongoUri(
    config.get('DB_HOST'),
    config.get('DB_USER') || undefined,
    config.get('DB_PASSWORD') || undefined,
    config.get('DB_NAME')
  );

  await databaseClient.connect(uri);

  const app = container.get<Application>(Component.Application);
  app.init();
}

bootstrap();
