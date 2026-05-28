import { inject, injectable } from 'inversify';
import express, { type Express } from 'express';
import { Component } from '../shared/container/container.types.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { AppConfig } from '../shared/config/config.js';
import { Controller } from '../shared/http/types/controller.interface.js';
import { ExceptionFilter } from '../shared/http/exception-filter/exception-filter.interface.js';

@injectable()
export class Application {
  private readonly app: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: AppConfig,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.HttpExceptionFilter) private readonly httpExceptionFilter: ExceptionFilter,
    @inject(Component.UnknownExceptionFilter) private readonly unknownExceptionFilter: ExceptionFilter
  ) {
    this.app = express();
  }

  public init(): void {
    this.app.use(express.json());
    this.app.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.registerControllers(this.userController, this.offerController, this.commentController);
    this.registerExceptionFilters(this.httpExceptionFilter, this.unknownExceptionFilter);

    const port = this.config.get('PORT');
    this.app.listen(port, () => {
      this.logger.info(`Server started on port ${port}`);
    });

    this.logger.info('Application initialized');
  }

  private registerControllers(...controllers: Controller[]): void {
    controllers.forEach((controller) => this.app.use(`/api${controller.basePath}`, controller.router));
  }

  private registerExceptionFilters(...filters: ExceptionFilter[]): void {
    filters.forEach((filter) => this.app.use(filter.catch.bind(filter)));
  }
}
