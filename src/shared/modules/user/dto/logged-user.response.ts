import { Expose } from 'class-transformer';
import { UserResponse } from './user.response.js';

export class LoggedUserResponse extends UserResponse {
  @Expose()
  public token!: string;
}
