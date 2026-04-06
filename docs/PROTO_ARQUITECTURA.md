# 🏗️ Arquitectura Local — Prototipo KUMAR Store
**Versión:** PROTO-1.0 | Abril 2026  
**Entorno:** Desarrollo local (Windows/macOS + XAMPP)

---

## 1. Stack Local del Prototipo

| Capa | Tecnología | Puerto | Notas |
|------|-----------|--------|-------|
| **App Móvil** | React Native + Expo (TypeScript) | — | Android via Expo Go |
| **API REST** | Node.js + Fastify (TypeScript) | `3000` | Servidor local |
| **Base de Datos** | MySQL 8.0 vía XAMPP | `3306` | Gestionado con phpMyAdmin |
| **phpMyAdmin** | XAMPP bundled | `80` | `http://localhost/phpmyadmin` |

---

## 2. Estructura del Monorepo

```
ecommerce_app/                        ← Raíz del monorepo
│
├── package.json                    ← Workspaces config (npm/yarn)
├── turbo.json                      ← Turborepo pipeline
├── .env.local                      ← Variables de entorno compartidas
├── .gitignore
├── README.md
│
├── AGENT.md                        ← Instrucciones para el agente IA
├── docs/
│   ├── PROTO_SQL.sql               ← Script de BD para XAMPP
│   ├── PROTO_MODULOS.md            ← Módulos del prototipo
│   ├── PROTO_ARQUITECTURA.md       ← Este archivo
│   ├── PROTO_FLUJO_PANTALLAS.md    ← Flujos de pantallas
│   └── Kumar_Store.png             ← Imagen de referencia visual del logo de la empresa
│
├── apps/
│   ├── mobile/                     ← React Native + Expo
│   │   ├── app.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── babel.config.js
│   │   ├── app/                    ← Expo Router (file-based)
│   │   │   ├── _layout.tsx         ← Root layout + auth guard
│   │   │   ├── index.tsx           ← Splash / redirect
│   │   │   ├── (auth)/
│   │   │   │   ├── login.tsx
│   │   │   │   ├── register.tsx
│   │   │   │   └── forgot-password.tsx
│   │   │   ├── (guest)/
│   │   │   │   └── product/[slug].tsx
│   │   │   ├── (tabs)/
│   │   │   │   ├── _layout.tsx     ← Tab navigator
│   │   │   │   ├── index.tsx       ← Home
│   │   │   │   ├── catalog.tsx
│   │   │   │   ├── cart.tsx
│   │   │   │   ├── orders.tsx
│   │   │   │   └── profile.tsx
│   │   │   ├── product/
│   │   │   │   └── [slug].tsx
│   │   │   ├── checkout/
│   │   │   │   ├── address.tsx
│   │   │   │   ├── shipping.tsx
│   │   │   │   ├── payment.tsx
│   │   │   │   ├── summary.tsx
│   │   │   │   └── success.tsx
│   │   │   ├── orders/
│   │   │   │   └── [id].tsx
│   │   │   ├── profile/
│   │   │   │   ├── edit.tsx
│   │   │   │   ├── addresses.tsx
│   │   │   │   └── settings.tsx
│   │   │   └── admin/
│   │   │       ├── _layout.tsx     ← Admin guard (role = ADMIN)
│   │   │       ├── index.tsx       ← Dashboard
│   │   │       ├── products/
│   │   │       │   ├── index.tsx
│   │   │       │   └── [id].tsx    ← Crear/editar
│   │   │       └── orders/
│   │   │           ├── index.tsx
│   │   │           └── [id].tsx
│   │   ├── components/
│   │   │   ├── ui/                 ← Button, Input, Card, Badge, Modal...
│   │   │   ├── product/            ← ProductCard, VariantSelector, StockBadge...
│   │   │   ├── cart/               ← CartItem, CartSummary...
│   │   │   ├── order/              ← OrderCard, OrderTimeline, StatusBadge...
│   │   │   └── layout/             ← Header, OfflineBanner, SafeAreaWrapper...
│   │   ├── store/                  ← Zustand
│   │   │   ├── auth.store.ts
│   │   │   ├── cart.store.ts
│   │   │   └── ui.store.ts
│   │   ├── services/               ← Llamadas a la API
│   │   │   ├── api.client.ts       ← Axios + interceptor JWT
│   │   │   ├── auth.service.ts
│   │   │   ├── products.service.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── orders.service.ts
│   │   │   └── users.service.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   └── useOffline.ts
│   │   └── constants/
│   │       ├── colors.ts           ← Paleta KUMAR Store
│   │       ├── typography.ts
│   │       └── api.ts              ← BASE_URL local
│   │
│   └── api/                        ← Fastify Backend
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── app.ts              ← Bootstrap Fastify + plugins
│       │   ├── server.ts           ← Punto de entrada (port 3000)
│       │   ├── config/
│       │   │   ├── db.ts           ← Conexión MySQL (mysql2)
│       │   │   └── env.ts          ← Variables de entorno tipadas
│       │   ├── plugins/
│       │   │   ├── auth.plugin.ts  ← JWT + fastify-jwt
│       │   │   ├── cors.plugin.ts
│       │   │   └── ratelimit.plugin.ts
│       │   ├── middlewares/
│       │   │   ├── authenticate.ts ← Verificar JWT en rutas protegidas
│       │   │   └── admin.guard.ts  ← Verificar rol ADMIN
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.routes.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   └── auth.schema.ts
│       │   │   ├── products/
│       │   │   ├── categories/
│       │   │   ├── cart/
│       │   │   ├── orders/
│       │   │   ├── users/
│       │   │   ├── shipping/
│       │   │   └── admin/
│       │   └── utils/
│       │       ├── hash.ts         ← bcrypt helpers
│       │       ├── jwt.ts          ← sign/verify helpers
│       │       └── response.ts     ← Formato estándar de respuesta
│       └── .env
│
└── packages/
    └── shared/                     ← Tipos TypeScript compartidos
        ├── package.json
        ├── src/
        │   ├── types/
        │   │   ├── user.types.ts
        │   │   ├── product.types.ts
        │   │   ├── order.types.ts
        │   │   └── api.types.ts    ← ApiResponse<T>, PaginatedResponse<T>
        │   └── index.ts
        └── tsconfig.json
```

---

## 3. Configuración de Variables de Entorno

### `apps/api/.env`
```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos (XAMPP local)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=kumar_store_proto

# JWT
JWT_SECRET=kumar_store_super_secret_dev_2026
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS — IP local para Expo Go
CORS_ORIGIN=http://localhost:8081,exp://192.168.x.x:8081
```

### `apps/mobile/constants/api.ts`
```typescript
// ⚠️ Cambiar IP según la red local donde corre XAMPP/API
// Para Expo Go en dispositivo físico usar IP de la máquina
// Para emulador Android usar 10.0.2.2
export const BASE_URL = __DEV__
  ? 'http://192.168.x.x:3000'   // Dispositivo físico
  // ? 'http://10.0.2.2:3000'   // Emulador Android
  : 'https://api.kumarstore.com'; // Producción (futuro)
```

---

## 4. Flujo de Comunicación

```
[Expo Go — Dispositivo Android]
        │
        │  HTTP REST (mismo WiFi)
        │  Authorization: Bearer <JWT>
        ▼
[Fastify API — localhost:3000]
        │
        │  mysql2 driver
        ▼
[MySQL 8.0 — XAMPP — localhost:3306]
        │
        │  (Solo para administración visual)
        ▼
[phpMyAdmin — localhost:80/phpmyadmin]
```

---

## 5. Formato Estándar de Respuesta API

```typescript
// packages/shared/src/types/api.types.ts

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Ejemplos de respuesta

```json
// Éxito
{ "success": true, "data": { "id": "...", "name": "Bolso Negro" } }

// Error de validación
{ "success": false, "error": "El email ya está registrado" }

// Paginado
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 10, "total": 45, "totalPages": 5 }
}
```

---

## 6. Autenticación — Flujo de Tokens

```
Login exitoso
    │
    ├─→ access_token  (JWT, expira 1h)   → guardado en memoria (Zustand)
    └─→ refresh_token (UUID, 7d en BD)   → guardado en SecureStore (Expo)

Cada request autenticado:
    Header: Authorization: Bearer <access_token>

Al expirar el access_token:
    POST /auth/refresh  { refreshToken: <refresh_token> }
    └─→ Nuevo access_token

Interceptor Axios (api.client.ts):
    Si respuesta 401 → intentar refresh → reintentar request original
    Si refresh falla → logout forzado → navegar a Login
```

---

## 7. Comandos de Desarrollo

```bash
# Instalar dependencias (desde raíz del monorepo)
npm install

# Iniciar XAMPP (Apache + MySQL) — manual desde panel XAMPP

# Importar BD en phpMyAdmin:
#   1. Abrir http://localhost/phpmyadmin
#   2. Nueva BD: kumar_store_proto
#   3. Importar: docs/PROTO_SQL.sql

# Iniciar API (terminal 1)
cd apps/api && npm run dev
# Disponible en: http://localhost:3000

# Iniciar app móvil (terminal 2)
cd apps/mobile && npx expo start
# Escanear QR con Expo Go en dispositivo Android
```

---

## 8. Dependencias Clave del Proyecto

### `apps/api/package.json` (principales)
```json
{
  "dependencies": {
    "fastify": "^4.28.0",
    "@fastify/jwt": "^8.0.0",
    "@fastify/cors": "^9.0.0",
    "@fastify/rate-limit": "^9.0.0",
    "mysql2": "^3.9.0",
    "bcrypt": "^5.1.1",
    "uuid": "^9.0.0",
    "zod": "^3.22.0",
    "dotenv": "^16.4.0"
  }
}
```

### `apps/mobile/package.json` (principales)
```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "^3.5.0",
    "react-native": "0.74.x",
    "react-native-reanimated": "^3.10.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.28.0",
    "axios": "^1.6.0",
    "nativewind": "^4.0.1",
    "expo-secure-store": "^13.0.0",
    "@react-native-community/netinfo": "^11.3.0",
    "lottie-react-native": "^6.7.0"
  }
}
```
