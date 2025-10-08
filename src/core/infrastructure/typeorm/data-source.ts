import 'dotenv/config';
import { DataSource } from 'typeorm';
import { typeormConfig } from './typeorm.config';

const cfg = typeormConfig();
export default new DataSource({ ...(cfg as any), migrations: ['src/migrations/*.ts'], });
