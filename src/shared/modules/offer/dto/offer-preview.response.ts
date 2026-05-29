import { Expose, Type } from 'class-transformer';
import type { HousingType } from '../../../types/housing-type.enum.js';

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

export class OfferPreviewResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public type!: HousingType;

  @Expose()
  public price!: number;

  @Expose()
  @Type(() => CityResponse)
  public city!: CityResponse;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public postDate!: string;

  @Expose()
  public commentCount!: number;
}
