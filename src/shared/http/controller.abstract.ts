import express, { Router, type Response } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import type { Controller } from './types/controller.interface.js';
import type { Route } from './types/route.type.js';

export abstract class AbstractController implements Controller {
  public readonly router: Router;

  constructor(public readonly basePath: string) {
    this.router = express.Router();
  }

  protected addRoute(route: Route): void {
    const middlewares = route.middlewares ?? [];
    const middlewareHandlers = middlewares.map((middleware) => asyncHandler(middleware.execute.bind(middleware)));
    this.router[route.method](route.path, ...middlewareHandlers, asyncHandler(route.handler));
  }

  protected ok<T>(res: Response, data: T): void {
    res.status(StatusCodes.OK).json(data);
  }

  protected created<T>(res: Response, data: T): void {
    res.status(StatusCodes.CREATED).json(data);
  }

  protected noContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).send();
  }
}
