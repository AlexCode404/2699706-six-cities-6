import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';
import { Component } from '../../container/container.types.js';
import type { TokenService } from '../../libs/token/token-service.interface.js';
import type { UserService } from '../../modules/user/user-service.interface.js';
import { HttpError } from '../exceptions/http.error.js';

@injectable()
export class PrivateRouteMiddleware {
  constructor(
    @inject(Component.TokenService) private readonly tokenService: TokenService,
    @inject(Component.UserService) private readonly userService: UserService
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader) {
      next(new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization header is missing'));
      return;
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid authorization header format'));
      return;
    }

    const userId = this.tokenService.verifyToken(token);
    if (!userId) {
      next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token'));
      return;
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      next(new HttpError(StatusCodes.UNAUTHORIZED, 'Token user not found'));
      return;
    }

    req.auth = { token, user };
    next();
  }
}
