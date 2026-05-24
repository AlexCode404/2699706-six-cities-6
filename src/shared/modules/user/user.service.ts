import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { UserModel } from './user.model.js';
import type { UserDocument } from './user.model.js';
import type { UserService } from './user-service.interface.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import { OfferModel } from '../offer/offer.model.js';
import type { OfferDocument } from '../offer/offer.model.js';

@injectable()
export class DefaultUserService implements UserService {
  public async create(dto: CreateUserDto): Promise<UserDocument> {
    const createdUser = await UserModel.create({
      ...dto,
      avatarPath: dto.avatarPath ?? '',
      favorites: [],
    });

    return createdUser as UserDocument;
  }

  public async findById(id: string): Promise<UserDocument | null> {
    const user = await UserModel.findById(id).exec();
    return user as UserDocument | null;
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await UserModel.findOne({ email }).exec();
    return user as UserDocument | null;
  }

  public async findAny(): Promise<UserDocument | null> {
    const user = await UserModel.findOne().exec();
    return user as UserDocument | null;
  }

  public async getFavorites(userId: string): Promise<OfferDocument[]> {
    const user = await UserModel.findById(userId).exec();

    if (!user || user.favorites.length === 0) {
      return [];
    }

    const offers = await OfferModel.find({
      _id: { $in: user.favorites },
    })
      .sort({ postDate: -1 })
      .exec();
    return offers as OfferDocument[];
  }

  public async addFavorite(userId: string, offerId: string): Promise<UserDocument | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: new Types.ObjectId(offerId) } },
      { new: true }
    ).exec();
    return user as UserDocument | null;
  }

  public async removeFavorite(userId: string, offerId: string): Promise<UserDocument | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: new Types.ObjectId(offerId) } },
      { new: true }
    ).exec();
    return user as UserDocument | null;
  }
}
