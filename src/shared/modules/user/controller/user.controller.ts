import { inject, injectable } from 'inversify';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AbstractController } from '../../../http/controller.abstract.js';
import { HttpMethod } from '../../../http/types/route.type.js';
import { Component } from '../../../container/container.types.js';
import type { UserService } from '../user-service.interface.js';
import { HttpError } from '../../../http/exceptions/http.error.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { LoginUserDto } from '../dto/login-user.dto.js';
import type { TokenService } from '../../../libs/token/token-service.interface.js';
import { fillDTO, fillResponseDTO } from '../../../libs/rest/transformer.js';
import { UserResponse } from '../dto/user.response.js';
import { LoggedUserResponse } from '../dto/logged-user.response.js';
import { mapUser } from './user.mapper.js';
import type { PrivateRouteMiddleware } from '../../../http/middleware/private-route.middleware.js';
import type { ValidateDtoMiddleware } from '../../../http/middleware/validate-dto.middleware.js';
import type { RequestBody } from '../../../http/types/request-params.type.js';

@injectable()
export class UserController extends AbstractController {
  constructor(
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.TokenService) private readonly tokenService: TokenService,
    @inject(Component.PrivateRouteMiddleware) private readonly privateRouteMiddleware: PrivateRouteMiddleware,
    @inject(Component.ValidateDtoMiddleware) private readonly validateDtoMiddleware: ValidateDtoMiddleware
  ) {
    super('/users');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.register,
      middlewares: [this.validateDtoMiddleware.execute(CreateUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [this.validateDtoMiddleware.execute(LoginUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuth,
      middlewares: [this.privateRouteMiddleware],
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
      middlewares: [this.privateRouteMiddleware],
    });
  }

  private register = async (req: Request<unknown, unknown, RequestBody<CreateUserDto>>, res: Response): Promise<void> => {
    const dto = fillDTO(CreateUserDto, req.body);
    const existingUser = await this.userService.findByEmail(dto.email);

    if (existingUser) {
      throw new HttpError(StatusCodes.CONFLICT, 'User with this email already exists');
    }

    const createdUser = await this.userService.create(dto);
    const responseDto = fillResponseDTO(UserResponse, mapUser(createdUser));
    this.created(res, responseDto);
  };

  private login = async (req: Request<unknown, unknown, RequestBody<LoginUserDto>>, res: Response): Promise<void> => {
    const dto = fillDTO(LoginUserDto, req.body);
    const user = await this.userService.findByEmail(dto.email);

    if (!user || user.password !== dto.password) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const token = this.tokenService.createToken(user.id);
    const responseDto = fillResponseDTO(LoggedUserResponse, { ...mapUser(user), token });
    this.ok(res, responseDto);
  };

  private checkAuth = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    const responseDto = fillResponseDTO(UserResponse, mapUser(req.auth.user));
    this.ok(res, responseDto);
  };

  private logout = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    this.tokenService.invalidateToken(req.auth.token);
    this.noContent(res);
  };
}
