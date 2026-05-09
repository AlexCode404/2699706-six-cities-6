import type { Amenity } from '../../../types/amenity.enum.js';
import type { City } from '../../../types/city.type.js';
import type { HousingType } from '../../../types/housing-type.enum.js';
import type { Location } from '../../../types/offer.type.js';

export type UpdateOfferDto = {
  title?: string;
  description?: string;
  city?: City;
  previewImage?: string;
  images?: string[];
  isPremium?: boolean;
  type?: HousingType;
  bedrooms?: number;
  maxAdults?: number;
  price?: number;
  amenities?: Amenity[];
  location?: Location;
};
