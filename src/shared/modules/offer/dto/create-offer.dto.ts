import type { Types } from 'mongoose';
import type { Amenity } from '../../../types/amenity.enum.js';
import type { HousingType } from '../../../types/housing-type.enum.js';
import type { Location } from '../../../types/offer.type.js';

export type CreateOfferDto = {
  title: string;
  description: string;
  city: Types.ObjectId;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  amenities: Amenity[];
  host: Types.ObjectId;
  location: Location;
};
