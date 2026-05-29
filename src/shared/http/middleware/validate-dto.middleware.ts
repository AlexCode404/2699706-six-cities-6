import { injectable } from 'inversify';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../exceptions/http.error.js';
import type { Middleware } from '../types/middleware.interface.js';

type RequestProperty = 'body' | 'query';

@injectable()
export class ValidateDtoMiddleware {
  public execute<T extends object>(
    dtoClass: new () => T,
    property: RequestProperty = 'body'
  ): Middleware {
    return {
      execute: async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        const plainObject = req[property];

        if (plainObject === undefined || plainObject === null) {
          const message = property === 'body'
            ? 'Request body is required. Use Content-Type: application/json'
            : 'Request data is required';
          next(new HttpError(StatusCodes.BAD_REQUEST, message));
          return;
        }

        const dtoInstance = plainToInstance(dtoClass, plainObject);
        const errors = await validate(dtoInstance, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
          const message = errors
            .flatMap((error) => Object.values(error.constraints ?? {}))
            .join('; ');
          next(new HttpError(StatusCodes.BAD_REQUEST, message || 'Validation error'));
          return;
        }

        if (property === 'body') {
          req.body = dtoInstance as typeof req.body;
        }

        next();
      },
    };
  }
}
