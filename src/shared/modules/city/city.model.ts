import { Schema, model, type InferSchemaType } from 'mongoose';

const citySchema = new Schema(
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

export type CityEntity = InferSchemaType<typeof citySchema>;
export const CityModel = model('City', citySchema);
export type CityDocument = ReturnType<(typeof CityModel)['hydrate']>;
