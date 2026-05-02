import { Schema, model, type HydratedDocument } from 'mongoose';
import type { City } from '../../types/city.type.js';

export type CityEntity = City;
export type CityDocument = HydratedDocument<CityEntity>;

const citySchema = new Schema<CityEntity>(
  {
    name: {
      type: String,
      required: true,
    },
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
    timestamps: true,
  }
);

export const CityModel = model<CityEntity>('City', citySchema);
