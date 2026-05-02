import type { City } from '../../types/city.type.js';
import type { CityDocument } from './city.model.js';
import type { CreateCityDto } from './dto/create-city.dto.js';

export interface CityService {
  create(dto: CreateCityDto): Promise<CityDocument>;
  findById(id: string): Promise<CityDocument | null>;
  findByName(name: City['name']): Promise<CityDocument | null>;
}
