import { injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../exceptions/http.error.js';
import type { Middleware } from '../types/middleware.interface.js';
import type { DocumentExists } from '../../libs/document-exists/document-exists.interface.js';

@injectable()
export class DocumentExistsMiddleware {
  public execute(
    service: DocumentExists,
    paramName: string,
    notFoundMessage = 'Document not found'
  ): Middleware {
    return {
      execute: async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        const paramValue = req.params[paramName];
        const documentId = Array.isArray(paramValue) ? paramValue[0] : paramValue;

        if (!documentId) {
          next(new HttpError(StatusCodes.BAD_REQUEST, 'Document id is required'));
          return;
        }

        const exists = await service.exists(documentId);
        if (!exists) {
          next(new HttpError(StatusCodes.NOT_FOUND, notFoundMessage));
          return;
        }

        next();
      },
    };
  }
}
