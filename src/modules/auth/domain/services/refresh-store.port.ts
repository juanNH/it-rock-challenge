export const REFRESH_STORE = Symbol('REFRESH_STORE');

export interface IRefreshStore {
  save(jti: string, userId: string, ttlSeconds: number): Promise<void>;
  get(jti: string): Promise<string | null>;
  revoke(jti: string): Promise<void>;
}
