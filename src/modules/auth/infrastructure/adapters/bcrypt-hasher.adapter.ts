import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../domain/services/password-hasher.port';

@Injectable()
export class BcryptHasherAdapter implements IPasswordHasher {
  hash(plain: string) { return bcrypt.hash(plain, 10); }
  compare(plain: string, hashed: string) { return bcrypt.compare(plain, hashed); }
}
