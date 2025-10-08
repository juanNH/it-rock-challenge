export class User {
  constructor(
    public readonly id: string,
    public username: string,
    public roleId: string,
    public lastLoginAt?: Date | null,
    public lockedUntil?: Date | null,
    public failedLoginAttempts: number = 0,
  ) {}



  registerSuccessfulLogin(at: Date = new Date()) {
    this.lastLoginAt = at;
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
  }

  registerFailedLogin(now: Date = new Date(), maxFails = 5, lockMinutes = 15) {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= maxFails) {
      const until = new Date(now.getTime() + lockMinutes * 60_000);
      this.lockedUntil = until;
      this.failedLoginAttempts = 0; // opcional: reiniciar al bloquear
    }
  }

  canLogin(now: Date = new Date()): boolean {
    return (!this.lockedUntil || this.lockedUntil <= now);
  }
}
