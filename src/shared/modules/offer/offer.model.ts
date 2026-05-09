import { Schema, model, type InferSchemaType } from 'mongoose';
import { HousingType } from '../../types/housing-type.enum.js';

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

export type OfferEntity = InferSchemaType<typeof offerSchema>;

export const OfferModel = model('Offer', offerSchema);
export type OfferDocument = ReturnType<(typeof OfferModel)['hydrate']>;
