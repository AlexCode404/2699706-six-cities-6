import { injectable } from 'inversify';
import { City } from '../../types/city.type.js';
import { CityModel, CityDocument } from './city.model.js';
import { CityService } from './city-service.interface.js';
import { CreateCityDto } from './dto/create-city.dto.js';

@injectable()
export class DefaultCityService implements CityService {
  public async create(dto: CreateCityDto): Promise<CityDocument> {
    return CityModel.create(dto);
  }

  public async findById(id: string): Promise<CityDocument | null> {
    return CityModel.findById(id).exec();
  }

  public async findByName(name: City['name']): Promise<CityDocument | null> {
    return CityModel.findOne({ name }).exec();
  }
}
