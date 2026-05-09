import { Expose } from 'class-transformer';
import type { UserType } from '../../../types/user.type.js';

export class UserResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarPath!: string;

  @Expose()
  public type!: UserType;
}
