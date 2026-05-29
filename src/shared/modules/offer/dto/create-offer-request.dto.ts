import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Amenity } from '../../../types/amenity.enum.js';
import { CITY_NAMES } from '../../../types/city-names.const.js';
import type { CityName } from '../../../types/city.type.js';
import { HousingType } from '../../../types/housing-type.enum.js';

class LocationRequestDto {
  @IsNumber()
  public latitude!: number;

  @IsNumber()
  public longitude!: number;
}

class CityRequestDto {
  @IsIn(CITY_NAMES)
  public name!: CityName;

  @ValidateNested()
  @Type(() => LocationRequestDto)
  public location!: LocationRequestDto;
}

export class CreateOfferRequestDto {
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  public title!: string;

  @IsString()
  @MinLength(20)
  @MaxLength(1024)
  public description!: string;

  @ValidateNested()
  @Type(() => CityRequestDto)
  public city!: CityRequestDto;

  @IsUrl()
  public previewImage!: string;

  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsUrl({}, { each: true })
  public images!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsEnum(HousingType)
  public type!: HousingType;

  @IsInt()
  @Min(1)
  @Max(8)
  public bedrooms!: number;

  @IsInt()
  @Min(1)
  @Max(10)
  public maxAdults!: number;

  @IsInt()
  @Min(100)
  @Max(100000)
  public price!: number;

  @IsArray()
  @IsEnum(Amenity, { each: true })
  public amenities!: Amenity[];

  @ValidateNested()
  @Type(() => LocationRequestDto)
  public location!: LocationRequestDto;
}
