import { Schema, model, type HydratedDocument, Types } from 'mongoose';
import { UserType } from '../../types/user.type.js';

export type UserEntity = {
  name: string;
  email: string;
  avatarPath: string;
  password?: string;
  type: UserType;
  favorites: Types.ObjectId[];
};

export type UserDocument = HydratedDocument<UserEntity>;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatarPath: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: Object.values(UserType),
      required: true,
    },
    favorites: {
      type: [Schema.Types.ObjectId],
      ref: 'Offer',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model('User', userSchema);
