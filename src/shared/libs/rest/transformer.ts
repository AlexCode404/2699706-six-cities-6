import { plainToInstance, instanceToPlain } from 'class-transformer';

export function fillDTO<T, V>(dto: new () => T, plainObject: V): T {
  return plainToInstance(dto, plainObject);
}

export function fillDTOArray<T, V>(dto: new () => T, plainObjects: V[]): T[] {
  return plainObjects.map((item) => fillDTO(dto, item));
}

export function fillResponseDTO<T, V>(dto: new () => T, plainObject: V): T {
  return plainToInstance(dto, plainObject, { excludeExtraneousValues: true });
}

export function fillResponseDTOArray<T, V>(dto: new () => T, plainObjects: V[]): T[] {
  return plainObjects.map((item) => fillResponseDTO(dto, item));
}

export function toPlain<T>(instance: T): Record<string, unknown> {
  return instanceToPlain(instance) as Record<string, unknown>;
}
