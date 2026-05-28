import { Expose } from 'class-transformer';

export class AuthTokenResponse {
  @Expose()
  public token!: string;
}
