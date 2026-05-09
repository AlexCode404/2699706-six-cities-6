import type { UserDocument } from '../user.model.js';

type UserPayload = {
  id: string;
  name: string;
  email: string;
  avatarPath: string;
  type: string;
};

export function mapUser(user: UserDocument): UserPayload {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarPath: user.avatarPath ?? '',
    type: user.type,
  };
}
