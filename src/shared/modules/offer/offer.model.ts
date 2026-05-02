import { Schema, model, type HydratedDocument, Types } from 'mongoose';
import { Amenity } from '../../types/amenity.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import type { Location } from '../../types/offer.type.js';

export type OfferEntity = {
  title: string;
  description: string;
  postDate: Date;
  city: Types.ObjectId;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  amenities: Amenity[];
  host: Types.ObjectId;
  commentCount: number;
  location: Location;
};

export type OfferDocument = HydratedDocument<OfferEntity>;

const locationSchema = new Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const offerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    postDate: {
      type: Date,
      required: true,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    previewImage: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    isPremium: {
      type: Boolean,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(HousingType),
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    maxAdults: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      required: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentCount: {
      type: Number,
      required: true,
    },
    location: {
      type: locationSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const OfferModel = model<OfferEntity>('Offer', offerSchema);
