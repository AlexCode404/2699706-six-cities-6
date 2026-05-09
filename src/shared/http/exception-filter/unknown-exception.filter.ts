import { inject, injectable } from 'inversify';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';
import { Component } from '../../container/container.types.js';
import type { Logger } from '../../libs/logger/logger.interface.js';
import type { ExceptionFilter } from './exception-filter.interface.js';

@injectable()
export class UnknownExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  public catch(error: unknown, req: Request, res: Response, _next: NextFunction): void {
    const message = error instanceof Error ? error.message : 'Unknown error';

    this.logger.error(`[${req.method}] ${req.path} -> ${StatusCodes.INTERNAL_SERVER_ERROR} ${message}`);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
}
