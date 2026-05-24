import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserType } from '../../../types/user.type.js';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsOptional()
  @IsString()
  @Matches(/\.(jpg|png)$/i)
  public avatarPath?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(12)
  public password!: string;

  @IsEnum(UserType)
  public type!: UserType;
}
