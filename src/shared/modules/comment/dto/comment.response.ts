import { Expose, Type } from 'class-transformer';
import type { UserType } from '../../../types/user.type.js';

class CommentAuthorResponse {
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

export class CommentResponse {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose()
  @Type(() => CommentAuthorResponse)
  public author!: CommentAuthorResponse;

  @Expose()
  public createdAt!: string;
}
