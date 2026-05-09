import type { UserType } from '../../../types/user.type.js';

export type CreateUserDto = {
  name: string;
  email: string;
  avatarPath?: string;
  password?: string;
  type: UserType;
};
