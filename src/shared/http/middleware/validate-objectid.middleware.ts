import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../exceptions/http.error.js';
import type { Middleware } from '../types/middleware.interface.js';

@injectable()
export class ValidateObjectIdMiddleware implements Middleware {
  public execute(req: Request, _res: Response, next: NextFunction): void {
    for (const paramValue of Object.values(req.params)) {
      const value = Array.isArray(paramValue) ? paramValue[0] : paramValue;

      if (value !== undefined && !Types.ObjectId.isValid(value)) {
        next(new HttpError(StatusCodes.BAD_REQUEST, 'Invalid ObjectId'));
        return;
      }
    }

    next();
  }
}
