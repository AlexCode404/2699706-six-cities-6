import { IsIn } from 'class-validator';
import { CITY_NAMES } from '../../../types/city-names.const.js';
import type { CityName } from '../../../types/city.type.js';

export class OffersPremiumQueryDto {
  @IsIn(CITY_NAMES)
  public city!: CityName;
}
