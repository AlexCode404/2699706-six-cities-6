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
  IsOptional,
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

class CityRequestDto {
  @IsIn(CITY_NAMES)
  public name!: CityName;

  @IsNumber()
  public latitude!: number;

  @IsNumber()
  public longitude!: number;
}

class LocationRequestDto {
  @IsNumber()
  public latitude!: number;

  @IsNumber()
  public longitude!: number;
}

export class UpdateOfferRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  public title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(1024)
  public description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CityRequestDto)
  public city?: CityRequestDto;

  @IsOptional()
  @IsUrl()
  public previewImage?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsUrl({}, { each: true })
  public images?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HousingType)
  public type?: HousingType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  public bedrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  public maxAdults?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(100000)
  public price?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(Amenity, { each: true })
  public amenities?: Amenity[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationRequestDto)
  public location?: LocationRequestDto;
}
