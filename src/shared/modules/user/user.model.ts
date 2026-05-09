import { Schema, model, type InferSchemaType } from 'mongoose';
import { UserType } from '../../types/user.type.js';

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

export type UserEntity = InferSchemaType<typeof userSchema>;

export const UserModel = model('User', userSchema);
export type UserDocument = ReturnType<(typeof UserModel)['hydrate']>;
