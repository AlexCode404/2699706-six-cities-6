import { injectable } from 'inversify';
import type { City } from '../../types/city.type.js';
import { CityModel } from './city.model.js';
import type { CityDocument } from './city.model.js';
import type { CityService } from './city-service.interface.js';
import type { CreateCityDto } from './dto/create-city.dto.js';

@injectable()
export class DefaultCityService implements CityService {
  public async create(dto: CreateCityDto): Promise<CityDocument> {
    const city = await CityModel.create(dto);
    return city as CityDocument;
  }

  public async findById(id: string): Promise<CityDocument | null> {
    const city = await CityModel.findById(id).exec();
    return city as CityDocument | null;
  }

  public async findByName(name: City['name']): Promise<CityDocument | null> {
    const city = await CityModel.findOne({ name }).exec();
    return city as CityDocument | null;
  }
}
