import type { OfferDocument } from '../offer/offer.model.js';
import type { UserDocument } from './user.model.js';
import type { CreateUserDto } from './dto/create-user.dto.js';

export interface UserService {
  create(dto: CreateUserDto): Promise<UserDocument>;
  verifyPassword(password: string, hashedPassword?: string): Promise<boolean>;
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  findAny(): Promise<UserDocument | null>;
  getFavorites(userId: string): Promise<OfferDocument[]>;
  addFavorite(userId: string, offerId: string): Promise<UserDocument | null>;
  removeFavorite(userId: string, offerId: string): Promise<UserDocument | null>;
  updateAvatarPath(userId: string, avatarPath: string): Promise<UserDocument | null>;
}
