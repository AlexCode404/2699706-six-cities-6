import { injectable } from 'inversify';
import { OfferModel } from './offer.model.js';
import type { OfferDocument } from './offer.model.js';
import type { OfferService } from './offer-service.interface.js';
import type { CreateOfferDto } from './dto/create-offer.dto.js';
import type { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CommentModel } from '../comment/comment.model.js';
import { CityModel } from '../city/city.model.js';

const DEFAULT_OFFER_LIMIT = 60;
const DEFAULT_PREMIUM_LIMIT = 3;

@injectable()
export class DefaultOfferService implements OfferService {
  public async create(dto: CreateOfferDto): Promise<OfferDocument> {
    const offer = await OfferModel.create({
      ...dto,
      postDate: new Date(),
      rating: 0,
      commentCount: 0,
    });

    return offer as OfferDocument;
  }

  public async findById(id: string): Promise<OfferDocument | null> {
    const offer = await OfferModel.findById(id).exec();
    return offer as OfferDocument | null;
  }

  public async find(limit: number = DEFAULT_OFFER_LIMIT): Promise<OfferDocument[]> {
    const offers = await OfferModel.find()
      .sort({ postDate: -1 })
      .limit(limit)
      .exec();
    return offers as OfferDocument[];
  }

  public async findByIdAndHostId(id: string, hostId: string): Promise<OfferDocument | null> {
    const offer = await OfferModel.findOne({
      _id: id,
      host: hostId,
    })
      .exec();
    return offer as OfferDocument | null;
  }

  public async findPremiumByCity(cityId: string, limit: number = DEFAULT_PREMIUM_LIMIT): Promise<OfferDocument[]> {
    const offers = await OfferModel.find({
      city: cityId,
      isPremium: true,
    })
      .sort({ postDate: -1 })
      .limit(limit)
      .exec();
    return offers as OfferDocument[];
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<OfferDocument | null> {
    const update = { ...dto } as Record<string, unknown>;

    if (dto.city) {
      let city = await CityModel.findOne({ name: dto.city.name }).exec();
      if (!city) {
        await CityModel.collection.insertOne(dto.city);
        city = await CityModel.findOne({ name: dto.city.name }).exec();
      }
      if (city) {
        update.city = (city as { _id: unknown })._id;
      }
    }

    const offer = await OfferModel.findByIdAndUpdate(id, update, { new: true }).exec();
    return offer as OfferDocument | null;
  }

  public async deleteById(id: string): Promise<OfferDocument | null> {
    const deletedOffer = await OfferModel.findByIdAndDelete(id).exec();

    if (deletedOffer) {
      await CommentModel.deleteMany({ offer: id }).exec();
    }

    return deletedOffer as OfferDocument | null;
  }
}
