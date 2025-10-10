export const Env = () => ({
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '3000', 10),

  DB: {
    HOST: process.env.DB_HOST ?? 'localhost',
    PORT: parseInt(process.env.DB_PORT ?? '5432', 10),
    USER: process.env.DB_USER ?? 'postgres',
    PASS: process.env.DB_PASS ?? 'postgres',
    NAME: process.env.DB_NAME ?? '',
  },

  REDIS: {
    HOST: process.env.REDIS_HOST ?? 'localhost',
    PORT: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    TTL_MS: parseInt(process.env.REDIS_TTL_MS ?? '60000', 10),
  },

  JWT: {
    SECRET: process.env.JWT_SECRET ?? 'dev-secret',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',
  },

  LOG: {
    PINO_LEVEL: process.env.PINO_LEVEL ?? 'info'
  },
  EXTERNAL: {
    JSONPLACEHOLDER_BASE_URL: process.env.JSONPLACEHOLDER_BASE_URL,
    TIMEOUT_MS: parseInt(process.env.EXTERNAL_TIMEOUT_MS ?? '10000', 10),
  },
});
