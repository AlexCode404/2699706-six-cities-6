import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';
import { Component } from '../../container/container.types.js';
import type { Logger } from '../../libs/logger/logger.interface.js';
import { HttpError } from '../exceptions/http.error.js';
import type { ExceptionFilter } from './exception-filter.interface.js';

@injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      next(error);
      return;
    }

    this.logger.error(`[${req.method}] ${req.path} -> ${error.statusCode} ${error.message}`);

    res
      .status(error.statusCode ?? StatusCodes.BAD_REQUEST)
      .json({ message: error.message });
  }
}
