import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { UserModel, UserDocument } from './user.model.js';
import { UserService } from './user-service.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { OfferDocument, OfferModel } from '../offer/offer.model.js';

@injectable()
export class DefaultUserService implements UserService {
  public async create(dto: CreateUserDto): Promise<UserDocument> {
    return UserModel.create({
      ...dto,
      avatarPath: dto.avatarPath ?? '',
      favorites: [],
    });
  }

  public async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).exec();
  }

  public async getFavorites(userId: string): Promise<OfferDocument[]> {
    const user = await UserModel.findById(userId).exec();

    if (!user || user.favorites.length === 0) {
      return [];
    }

    return OfferModel.find({
      _id: { $in: user.favorites },
    })
      .sort({ postDate: -1 })
      .populate('city')
      .populate('host')
      .exec();
  }

  public async addFavorite(userId: string, offerId: string): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: new Types.ObjectId(offerId) } },
      { new: true }
    ).exec();
  }

  public async removeFavorite(userId: string, offerId: string): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: new Types.ObjectId(offerId) } },
      { new: true }
    ).exec();
  }
}
