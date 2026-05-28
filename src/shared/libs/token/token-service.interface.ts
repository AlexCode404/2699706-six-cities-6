export interface TokenService {
  createToken(userId: string): Promise<string>;
  verifyToken(token: string): Promise<string | null>;
  invalidateToken(token: string): Promise<void>;
}
