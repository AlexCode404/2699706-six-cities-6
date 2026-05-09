import { Container } from 'inversify';
import { Component } from './container.types.js';
import { Application } from '../../application/application.js';
import { Logger } from '../libs/logger/logger.interface.js';
import { PinoLogger } from '../libs/logger/pino.logger.js';
import { AppConfig, appConfig } from '../config/config.js';
import { DatabaseClient } from '../libs/database/database.interface.js';
import { MongoDatabaseClient } from '../libs/database/mongo.database-client.js';
import { UserService } from '../modules/user/user-service.interface.js';
import { DefaultUserService } from '../modules/user/user.service.js';
import { CityService } from '../modules/city/city-service.interface.js';
import { DefaultCityService } from '../modules/city/city.service.js';
import { OfferService } from '../modules/offer/offer-service.interface.js';
import { DefaultOfferService } from '../modules/offer/offer.service.js';
import { CommentService } from '../modules/comment/comment-service.interface.js';
import { DefaultCommentService } from '../modules/comment/comment.service.js';

const container = new Container();

container.bind<Application>(Component.Application).to(Application).inSingletonScope();
container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
container.bind<AppConfig>(Component.Config).toConstantValue(appConfig);
container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
container.bind<CityService>(Component.CityService).to(DefaultCityService).inSingletonScope();
container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();

export { container };
