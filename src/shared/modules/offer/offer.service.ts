import { injectable } from 'inversify';
import { OfferModel, OfferDocument } from './offer.model.js';
import { OfferService } from './offer-service.interface.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CommentModel } from '../comment/comment.model.js';
import { CityModel } from '../city/city.model.js';

const DEFAULT_OFFER_LIMIT = 60;
const DEFAULT_PREMIUM_LIMIT = 3;

@injectable()
export class DefaultOfferService implements OfferService {
  public async create(dto: CreateOfferDto): Promise<OfferDocument> {
    const offer = await OfferModel.create(dto);

    return OfferModel.findById(offer._id)
      .populate('city')
      .populate('host')
      .orFail()
      .exec();
  }

  public async findById(id: string): Promise<OfferDocument | null> {
    return OfferModel.findById(id)
      .populate('city')
      .populate('host')
      .exec();
  }

  public async find(limit: number = DEFAULT_OFFER_LIMIT): Promise<OfferDocument[]> {
    return OfferModel.find()
      .sort({ postDate: -1 })
      .limit(limit)
      .populate('city')
      .populate('host')
      .exec();
  }

  public async findByIdAndHostId(id: string, hostId: string): Promise<OfferDocument | null> {
    return OfferModel.findOne({
      _id: id,
      host: hostId,
    })
      .populate('city')
      .populate('host')
      .exec();
  }

  public async findPremiumByCity(cityId: string, limit: number = DEFAULT_PREMIUM_LIMIT): Promise<OfferDocument[]> {
    return OfferModel.find({
      city: cityId,
      isPremium: true,
    })
      .sort({ postDate: -1 })
      .limit(limit)
      .populate('city')
      .populate('host')
      .exec();
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<OfferDocument | null> {
    const update = { ...dto } as Record<string, unknown>;

    if (dto.city) {
      const city = await CityModel.findOne({ name: dto.city.name }).exec() ?? await CityModel.create(dto.city);
      update.city = city._id;
    }

    return OfferModel.findByIdAndUpdate(id, update, { new: true })
      .populate('city')
      .populate('host')
      .exec();
  }

  public async deleteById(id: string): Promise<OfferDocument | null> {
    const deletedOffer = await OfferModel.findByIdAndDelete(id)
      .populate('city')
      .populate('host')
      .exec();

    if (deletedOffer) {
      await CommentModel.deleteMany({ offer: id }).exec();
    }

    return deletedOffer;
  }
}
