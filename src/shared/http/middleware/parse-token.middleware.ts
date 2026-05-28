import { inject, injectable } from 'inversify';
import type { NextFunction, Request, Response } from 'express';
import { Component } from '../../container/container.types.js';
import type { TokenService } from '../../libs/token/token-service.interface.js';
import type { UserService } from '../../modules/user/user-service.interface.js';
import type { Middleware } from '../types/middleware.interface.js';

@injectable()
export class ParseTokenMiddleware implements Middleware {
  constructor(
    @inject(Component.TokenService) private readonly tokenService: TokenService,
    @inject(Component.UserService) private readonly userService: UserService
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader) {
      next();
      return;
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      next();
      return;
    }

    const userId = await this.tokenService.verifyToken(token);
    if (!userId) {
      next();
      return;
    }

    const user = await this.userService.findById(userId);
    if (user) {
      req.auth = { token, user };
    }

    next();
  }
}
