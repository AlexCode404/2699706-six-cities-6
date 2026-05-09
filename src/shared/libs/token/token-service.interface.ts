export interface TokenService {
  createToken(userId: string): string;
  verifyToken(token: string): string | null;
  invalidateToken(token: string): void;
}
