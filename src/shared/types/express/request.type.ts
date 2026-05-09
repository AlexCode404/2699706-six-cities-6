import type { UserDocument } from '../../modules/user/user.model.js';

export type AuthorizedRequest = {
  token: string;
  user: UserDocument;
};
