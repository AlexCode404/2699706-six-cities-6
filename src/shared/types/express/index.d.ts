import type { AuthorizedRequest } from './request.type.js';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthorizedRequest;
    }
  }
}

export {};
