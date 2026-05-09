import { randomUUID } from 'node:crypto';
import { injectable } from 'inversify';
import type { TokenService } from './token-service.interface.js';

@injectable()
export class InMemoryTokenService implements TokenService {
  private readonly tokenToUserMap = new Map<string, string>();

  public createToken(userId: string): string {
    const token = randomUUID();
    this.tokenToUserMap.set(token, userId);
    return token;
  }

  public verifyToken(token: string): string | null {
    return this.tokenToUserMap.get(token) ?? null;
  }

  public invalidateToken(token: string): void {
    this.tokenToUserMap.delete(token);
  }
}
