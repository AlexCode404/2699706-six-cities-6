import { webcrypto, randomUUID } from 'node:crypto';

if (!('crypto' in globalThis)) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}
import { inject, injectable } from 'inversify';
import * as jose from 'jose';
import { Component } from '../../container/container.types.js';
import type { AppConfig } from '../../config/config.js';
import type { TokenService } from './token-service.interface.js';

@injectable()
export class JwtTokenService implements TokenService {
  private readonly blacklistedTokens = new Set<string>();

  constructor(
    @inject(Component.Config) private readonly config: AppConfig
  ) {}

  public async createToken(userId: string): Promise<string> {
    const secret = this.getSecretKey();

    return new jose.SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(randomUUID())
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);
  }

  public async verifyToken(token: string): Promise<string | null> {
    try {
      const secret = this.getSecretKey();
      const { payload } = await jose.jwtVerify(token, secret);

      if (typeof payload.jti === 'string' && this.blacklistedTokens.has(payload.jti)) {
        return null;
      }

      return typeof payload.userId === 'string' ? payload.userId : null;
    } catch {
      return null;
    }
  }

  public async invalidateToken(token: string): Promise<void> {
    const payload = jose.decodeJwt(token);

    if (typeof payload.jti === 'string') {
      this.blacklistedTokens.add(payload.jti);
    }
  }

  private getSecretKey(): Uint8Array {
    return new TextEncoder().encode(this.config.get('SALT'));
  }
}
