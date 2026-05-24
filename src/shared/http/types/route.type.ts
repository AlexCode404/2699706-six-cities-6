import type { NextFunction, Request, Response } from 'express';
import type { Middleware } from './middleware.interface.js';

export enum HttpMethod {
  Get = 'get',
  Post = 'post',
  Patch = 'patch',
  Delete = 'delete',
}

export type Route = {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
  middlewares?: Middleware[];
};
