import type { OfferDocument } from './offer.model.js';
import type { CreateOfferDto } from './dto/create-offer.dto.js';
import type { UpdateOfferDto } from './dto/update-offer.dto.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<OfferDocument>;
  findById(id: string): Promise<OfferDocument | null>;
  find(limit?: number): Promise<OfferDocument[]>;
  findByIdAndHostId(id: string, hostId: string): Promise<OfferDocument | null>;
  findPremiumByCity(cityId: string, limit?: number): Promise<OfferDocument[]>;
  updateById(id: string, dto: UpdateOfferDto): Promise<OfferDocument | null>;
  deleteById(id: string): Promise<OfferDocument | null>;
}
