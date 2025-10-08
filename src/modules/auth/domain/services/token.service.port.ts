export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

export interface ITokenService {
  signAccess(payload: any, ttlSeconds: number): Promise<string>;
  signRefresh(payload: any, ttlSeconds: number): Promise<string>;
  verifyRefresh<T extends object>(token: string): Promise<T>;
}
