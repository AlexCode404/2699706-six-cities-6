import { Expose, Type } from 'class-transformer';
import type { Amenity } from '../../../types/amenity.enum.js';
import type { HousingType } from '../../../types/housing-type.enum.js';
import type { UserType } from '../../../types/user.type.js';

class CoordinatesResponse {
  @Expose()
  public latitude!: number;

  @Expose()
  public longitude!: number;
}

class CityResponse {
  @Expose()
  public name!: string;

  @Expose()
  @Type(() => CoordinatesResponse)
  public location!: CoordinatesResponse;
}

class HostResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarPath!: string;

  @Expose()
  public type!: UserType;
}

export class OfferResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: string;

  @Expose()
  @Type(() => CityResponse)
  public city!: CityResponse;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: HousingType;

  @Expose()
  public bedrooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public price!: number;

  @Expose()
  public amenities!: Amenity[];

  @Expose()
  @Type(() => HostResponse)
  public host!: HostResponse;

  @Expose()
  public commentCount!: number;

  @Expose()
  @Type(() => CoordinatesResponse)
  public location!: CoordinatesResponse;
}
