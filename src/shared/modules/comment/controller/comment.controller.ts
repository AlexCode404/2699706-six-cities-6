import { inject, injectable } from 'inversify';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AbstractController } from '../../../http/controller.abstract.js';
import { HttpMethod } from '../../../http/types/route.type.js';
import { Component } from '../../../container/container.types.js';
import { HttpError } from '../../../http/exceptions/http.error.js';
import { fillDTO, fillResponseDTO, fillResponseDTOArray } from '../../../libs/rest/transformer.js';
import type { CommentService } from '../comment-service.interface.js';
import type { OfferService } from '../../offer/offer-service.interface.js';
import type { UserService } from '../../user/user-service.interface.js';
import { CreateCommentRequestDto } from '../dto/create-comment-request.dto.js';
import { CommentResponse } from '../dto/comment.response.js';
import { mapComment } from './comment.mapper.js';
import type { ValidateObjectIdMiddleware } from '../../../http/middleware/validate-objectid.middleware.js';
import type { ValidateDtoMiddleware } from '../../../http/middleware/validate-dto.middleware.js';
import type { DocumentExistsMiddleware } from '../../../http/middleware/document-exists.middleware.js';
import type { CreateCommentDto } from '../dto/create-comment.dto.js';
import type { CommentDocument } from '../comment.model.js';

@injectable()
export class CommentController extends AbstractController {
  constructor(
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.ValidateObjectIdMiddleware) private readonly validateObjectIdMiddleware: ValidateObjectIdMiddleware,
    @inject(Component.ValidateDtoMiddleware) private readonly validateDtoMiddleware: ValidateDtoMiddleware,
    @inject(Component.DocumentExistsMiddleware) private readonly documentExistsMiddleware: DocumentExistsMiddleware
  ) {
    super('/comments');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        this.validateObjectIdMiddleware,
        this.documentExistsMiddleware.execute(this.offerService, 'offerId', 'Offer not found'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        this.validateObjectIdMiddleware,
        this.validateDtoMiddleware.execute(CreateCommentRequestDto),
        this.documentExistsMiddleware.execute(this.offerService, 'offerId', 'Offer not found'),
      ],
    });
  }

  private index = async (req: Request, res: Response): Promise<void> => {
    const offerId = this.getOfferId(req);
    const comments = await this.commentService.findByOfferId(offerId);
    const payload = await this.toCommentPayloadList(comments);
    this.ok(res, fillResponseDTOArray(CommentResponse, payload));
  };

  private create = async (req: Request, res: Response): Promise<void> => {
    const offerId = this.getOfferId(req);
    const dto = fillDTO(CreateCommentRequestDto, req.body);
    const userId = await this.resolveAuthorId(req);
    const comment = await this.commentService.create(userId, offerId, dto as CreateCommentDto);
    const payload = await this.toCommentPayload(comment);
    this.created(res, fillResponseDTO(CommentResponse, payload));
  };

  private async toCommentPayloadList(comments: CommentDocument[]) {
    const payload: unknown[] = [];
    for (const comment of comments) {
      payload.push(await this.toCommentPayload(comment));
    }

    return payload;
  }

  private async toCommentPayload(comment: CommentDocument) {
    const populatableComment = comment as unknown as { populate(path: string): Promise<unknown> };
    await populatableComment.populate('author');
    return mapComment(comment);
  }

  private async resolveAuthorId(req: Request): Promise<string> {
    if (req.auth?.user.id) {
      return req.auth.user.id;
    }

    const user = await this.userService.findAny();
    if (!user) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'No users available to assign as comment author');
    }

    return user.id;
  }

  private getOfferId(req: Request): string {
    const offerId = req.params.offerId;
    const normalizedOfferId = Array.isArray(offerId) ? offerId[0] : offerId;
    if (!normalizedOfferId) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Offer id is required');
    }

    return normalizedOfferId;
  }
}
