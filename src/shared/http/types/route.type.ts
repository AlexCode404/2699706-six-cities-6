import type { NextFunction, Request, Response } from 'express';

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
  middlewares?: Array<(req: Request, res: Response, next: NextFunction) => Promise<void> | void>;
};
