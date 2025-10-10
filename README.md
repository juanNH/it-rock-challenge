# It-Rock-Challenge API (NestJS · Clean/Hexagonal)

API con **NestJS**, arquitectura **Clean/Hexagonal (Onion)**, **TypeORM + PostgreSQL**, **Redis**, **JWT** (access/refresh), **rate limiting**, **Swagger**, y un **populate** de tareas desde una API externa.

---

## 🧱 Stack
- **Node 20+**, **NestJS 10+**
- **TypeORM** + **PostgreSQL**
- **Redis** (cache + refresh tokens)
- **Swagger / OpenAPI** (`/docs`)
- **@nestjs/throttler** (rate limit en login)
- **@nestjs/event-emitter** (eventos)
- **@nestjs/axios** (HTTP client)
- **Pino** (`nestjs-pino`) para logs

---

## 🏗️ Arquitectura (Clean/Hexagonal)
- **domain**: entidades, puertos (interfaces), lógica pura
- **application**: casos de uso, DTOs, orquestación
- **infrastructure**: controladores HTTP, repos TypeORM, adapters, módulos Nest

```
src/
  config/env.config.ts
  core/infrastructure/
    core.module.ts
    typeorm/data-source.ts
  modules/
    auth/...
    users/...
    tasks/...
migrations/
scripts/
  seed.sql
```

---

## ✅ Features
- **Auth**: `POST /auth/login` (access 15 min, refresh 7 días), `POST /auth/refresh`, `GET /auth/me`.
- **Rate limit** en `/auth/login`: 5 req/min.
- **Tasks**: CRUD con JWT; filtros & paginación; cache Redis 10 min por usuario.
- **Populate externo**: `GET /tasks/populate?limit=N` (JWT + `x-api-key`), dedup por `(user_id, external_source, external_id)`.
- **Eventos**: `TASK_CREATED`, `TASK_COMPLETED`.

---

## 🚀 Requisitos
- Node.js **v20+**
- Docker + Docker Compose
- npm (o pnpm/yarn)

---

## ⚙️ Variables de entorno
Crear **.env** en la raíz:
```env
# App
PORT=3000
NODE_ENV=development
PINO_LEVEL=info
JWT_SECRET=dev-secret

# DB
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=it_rock_challenge

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Externos
TASKS_POPULATE_API_KEY=super-api-key
EXTERNAL_TODOS_URL=https://jsonplaceholder.typicode.com
EXTERNAL_TIMEOUT_MS=10000
```

---

## ▶️ Cómo correr el proyecto

### 1) Instalar dependencias
```bash
npm install
```

### 2) Levantar infraestructura con Docker Compose
Crea `docker-compose.yml` en la raíz (si no lo tenés):
```yaml
version: '3.9'
services:
  pg:
    image: postgres:16
    container_name: it_rock_challenge_pg
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_DB: ${DB_NAME:-it_rock_challenge}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
  redis:
    image: redis:7
    container_name: it_rock_challenge_redis
    ports:
      - "${REDIS_PORT:-6379}:6379"
volumes:
  pgdata:
```
**Levantar contenedores:**
```bash
docker compose up -d
```

```

### 3) Migraciones (TypeORM)
Asegurate que `src/core/infrastructure/typeorm/data-source.ts` exporta un `DataSource` válido.
Agregá estos scripts en `package.json`:
```jsonc
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:gen": "npm run typeorm -- migration:generate -n Auto -d src/core/infrastructure/typeorm/data-source.ts",
    "migration:run": "npm run typeorm -- migration:run -d src/core/infrastructure/typeorm/data-source.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d src/core/infrastructure/typeorm/data-source.ts"
  }
}
```
**Ejecutar migraciones:**
```bash
npm run migration:run
```

### 4) Seed de datos (roles, usuario admin, etc.)
Colocá tu `scripts/seed.sql`. El script trae un usuario admin con password admin para probar su rol y un usario user con password user para verificar la validez de los endpoints, si se necesitan mas es libre para agregar en el sql.
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Roles
INSERT INTO roles (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin'),
  ('11111111-1111-1234-1111-111111111111', 'user')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (id, username, password_hash, role_id) VALUES
  ('22222222-2222-2222-2222-222222222222', 'admin', crypt('admin', gen_salt('bf', 10)), '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-3333-222222222222', 'user',  crypt('user',  gen_salt('bf', 10)), '11111111-1111-1234-1111-111111111111')
ON CONFLICT (username) DO NOTHING;
```
**Correr seed:**
- Correr en terminal:
  ```bash
  docker exec -i it_rock_challenge_pg psql -U postgres -d it_rock_challenge -v ON_ERROR_STOP=1 < scripts/seed.sql
  ```

### 5) Ejecutar la app
Desarrollo:
```bash
npm run start:dev
```
Producción:
```bash
npm run build
npm run start:prod
```
Swagger: <http://localhost:3000/docs>

---

### ✅ Resumen rápido de comandos
```bash
# 1) deps
npm i

# 2) infraestructura
docker compose up -d

# 3) migraciones
npm run migration:run

# 4) seed (elige uno)
docker exec -i it_rock_challenge_pg psql -U postgres -d it_rock_challenge -v ON_ERROR_STOP=1 < scripts/seed.sql

# 5) app
npm run start:dev
# Swagger: http://localhost:3000/docs
```
