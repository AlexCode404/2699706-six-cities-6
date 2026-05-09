import type { Amenity } from '../../../types/amenity.enum.js';
import type { City } from '../../../types/city.type.js';
import type { HousingType } from '../../../types/housing-type.enum.js';
import type { Location } from '../../../types/offer.type.js';

export class UpdateOfferRequestDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public type?: HousingType;
  public bedrooms?: number;
  public maxAdults?: number;
  public price?: number;
  public amenities?: Amenity[];
  public location?: Location;
}
