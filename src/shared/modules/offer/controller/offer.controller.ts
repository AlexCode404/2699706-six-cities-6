import { inject, injectable } from 'inversify';
import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { AbstractController } from '../../../http/controller.abstract.js';
import { HttpMethod } from '../../../http/types/route.type.js';
import { Component } from '../../../container/container.types.js';
import { HttpError } from '../../../http/exceptions/http.error.js';
import { fillDTO, fillResponseDTO, fillResponseDTOArray } from '../../../libs/rest/transformer.js';
import { OfferResponse } from '../dto/offer.response.js';
import { mapOffer } from './offer.mapper.js';
import type { OfferService } from '../offer-service.interface.js';
import type { UserService } from '../../user/user-service.interface.js';
import type { CityService } from '../../city/city-service.interface.js';
import { CreateOfferRequestDto } from '../dto/create-offer-request.dto.js';
import type { CreateOfferDto } from '../dto/create-offer.dto.js';
import { UpdateOfferRequestDto } from '../dto/update-offer-request.dto.js';
import type { UpdateOfferDto } from '../dto/update-offer.dto.js';
import { OffersIndexQueryDto } from '../dto/offers-index-query.dto.js';
import { OffersPremiumQueryDto } from '../dto/offers-premium-query.dto.js';
import type { PrivateRouteMiddleware } from '../../../http/middleware/private-route.middleware.js';
import type { ValidateObjectIdMiddleware } from '../../../http/middleware/validate-objectid.middleware.js';
import type { ValidateDtoMiddleware } from '../../../http/middleware/validate-dto.middleware.js';
import type { OfferDocument } from '../offer.model.js';
import type { RequestBody } from '../../../http/types/request-params.type.js';

@injectable()
export class OfferController extends AbstractController {
  constructor(
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CityService) private readonly cityService: CityService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.PrivateRouteMiddleware) private readonly privateRouteMiddleware: PrivateRouteMiddleware,
    @inject(Component.ValidateObjectIdMiddleware) private readonly validateObjectIdMiddleware: ValidateObjectIdMiddleware,
    @inject(Component.ValidateDtoMiddleware) private readonly validateDtoMiddleware: ValidateDtoMiddleware
  ) {
    super('/offers');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [this.validateDtoMiddleware.execute(OffersIndexQueryDto, 'query')],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        this.privateRouteMiddleware,
        this.validateDtoMiddleware.execute(CreateOfferRequestDto),
      ],
    });
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.premium,
      middlewares: [this.validateDtoMiddleware.execute(OffersPremiumQueryDto, 'query')],
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.favorites,
      middlewares: [this.privateRouteMiddleware],
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [this.validateObjectIdMiddleware, this.privateRouteMiddleware],
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Delete,
      handler: this.removeFavorite,
      middlewares: [this.validateObjectIdMiddleware, this.privateRouteMiddleware],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [this.validateObjectIdMiddleware],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        this.validateObjectIdMiddleware,
        this.privateRouteMiddleware,
        this.validateDtoMiddleware.execute(UpdateOfferRequestDto),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [this.validateObjectIdMiddleware, this.privateRouteMiddleware],
    });
  }

  private index = async (req: Request, res: Response): Promise<void> => {
    const query = fillDTO(OffersIndexQueryDto, req.query);
    const offers = await this.offerService.find(query.limit);
    const favoriteOfferIds = await this.getFavoriteIds(req.auth?.user.id);
    const payload = await this.toOfferPayloadList(offers, favoriteOfferIds);
    this.ok(res, fillResponseDTOArray(OfferResponse, payload));
  };

  private create = async (req: Request<unknown, unknown, RequestBody<CreateOfferRequestDto>>, res: Response): Promise<void> => {
    if (!req.auth) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    const dto = fillDTO(CreateOfferRequestDto, req.body);
    let city = await this.cityService.findByName(dto.city.name);
    if (!city) {
      city = await this.cityService.create(dto.city);
    }

    const createDto: CreateOfferDto = {
      ...dto,
      city: new Types.ObjectId(city.id),
      host: new Types.ObjectId(req.auth.user.id),
    };

    const offer = await this.offerService.create(createDto);
    const payload = await this.toOfferPayload(offer, await this.getFavoriteIds(req.auth.user.id));
    this.created(res, fillResponseDTO(OfferResponse, payload));
  };

  private show = async (req: Request, res: Response): Promise<void> => {
    const offerId = this.getOfferId(req);
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }

    const favoriteOfferIds = await this.getFavoriteIds(req.auth?.user.id);
    const payload = await this.toOfferPayload(offer, favoriteOfferIds);
    this.ok(res, fillResponseDTO(OfferResponse, payload));
  };

  private update = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    const offerId = this.getOfferId(req);
    const offer = await this.offerService.findByIdAndHostId(offerId, req.auth.user.id);
    if (!offer) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Offer does not belong to current user');
    }

    const dto = fillDTO(UpdateOfferRequestDto, req.body as RequestBody<UpdateOfferRequestDto>);
    const updatedOffer = await this.offerService.updateById(offerId, dto as UpdateOfferDto);
    if (!updatedOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }

    const favoriteOfferIds = await this.getFavoriteIds(req.auth.user.id);
    const payload = await this.toOfferPayload(updatedOffer, favoriteOfferIds);
    this.ok(res, fillResponseDTO(OfferResponse, payload));
  };

  private delete = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    const offerId = this.getOfferId(req);
    const offer = await this.offerService.findByIdAndHostId(offerId, req.auth.user.id);
    if (!offer) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Offer does not belong to current user');
    }

    await this.offerService.deleteById(offerId);
    this.noContent(res);
  };

  private premium = async (req: Request, res: Response): Promise<void> => {
    const query = fillDTO(OffersPremiumQueryDto, req.query);
    const city = await this.cityService.findByName(query.city);
    if (!city) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Invalid city name');
    }

    const offers = await this.offerService.findPremiumByCity(city.id);
    const favoriteOfferIds = await this.getFavoriteIds(req.auth?.user.id);
    const payload = await this.toOfferPayloadList(offers, favoriteOfferIds);
    this.ok(res, fillResponseDTOArray(OfferResponse, payload));
  };

  private favorites = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    const offers = await this.userService.getFavorites(req.auth.user.id);
    const favoriteOfferIds = await this.getFavoriteIds(req.auth.user.id);
    const payload = await this.toOfferPayloadList(offers, favoriteOfferIds);
    this.ok(res, fillResponseDTOArray(OfferResponse, payload));
  };

  private addFavorite = async (req: Request, res: Response): Promise<void> => {
    await this.changeFavoriteState(req, res, true);
  };

  private removeFavorite = async (req: Request, res: Response): Promise<void> => {
    await this.changeFavoriteState(req, res, false);
  };

  private async changeFavoriteState(req: Request, res: Response, shouldAdd: boolean): Promise<void> {
    if (!req.auth) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    const offerId = this.getOfferId(req);
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }

    if (shouldAdd) {
      await this.userService.addFavorite(req.auth.user.id, offerId);
    } else {
      await this.userService.removeFavorite(req.auth.user.id, offerId);
    }

    const favoriteOfferIds = await this.getFavoriteIds(req.auth.user.id);
    const payload = await this.toOfferPayload(offer, favoriteOfferIds);
    this.ok(res, fillResponseDTO(OfferResponse, payload));
  }

  private async toOfferPayloadList(offers: OfferDocument[], favoriteOfferIds: Set<string>) {
    const payload: unknown[] = [];
    for (const offer of offers) {
      payload.push(await this.toOfferPayload(offer, favoriteOfferIds));
    }

    return payload;
  }

  private async toOfferPayload(offer: OfferDocument, favoriteOfferIds: Set<string>) {
    const populatableOffer = offer as unknown as { populate(path: string): Promise<unknown> };
    await populatableOffer.populate('city');
    await populatableOffer.populate('host');
    return mapOffer(offer, favoriteOfferIds);
  }

  private async getFavoriteIds(userId?: string): Promise<Set<string>> {
    if (!userId) {
      return new Set();
    }

    const user = await this.userService.findById(userId);
    return new Set((user?.favorites ?? []).map((favoriteId) => favoriteId.toString()));
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
