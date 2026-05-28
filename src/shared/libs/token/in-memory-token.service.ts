import { randomUUID } from 'node:crypto';
import { injectable } from 'inversify';
import type { TokenService } from './token-service.interface.js';

@injectable()
export class InMemoryTokenService implements TokenService {
  private readonly tokenToUserMap = new Map<string, string>();

  public async createToken(userId: string): Promise<string> {
    const token = randomUUID();
    this.tokenToUserMap.set(token, userId);
    return token;
  }

  public async verifyToken(token: string): Promise<string | null> {
    return this.tokenToUserMap.get(token) ?? null;
  }

  public async invalidateToken(token: string): Promise<void> {
    this.tokenToUserMap.delete(token);
  }
}
