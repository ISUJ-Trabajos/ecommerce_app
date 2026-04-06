# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**KUMAR Store** is an e-commerce mobile app prototype for Ecuador (Quito). It's a Turborepo monorepo with:
- **Mobile app**: React Native + Expo + Expo Router
- **API**: Fastify + MySQL2 + JWT
- **Database**: MySQL 8.0 (via XAMPP)

Target market: Ecuador. Single-vendor store selling fashion, cosmetics/health, home/decor, and accessories.

## Documentation (Read Before Coding)

Before making changes, follow the instructions in `AGENT.md` and read these files in `docs/`:

| File | Content |
|------|---------|
| `PROTO_MODULOS.md` | 7 modules, endpoints, critical business logic |
| `PROTO_ARQUITECTURA.md` | Folder structure, env vars, dependencies |
| `PROTO_FLUJO_PANTALLAS.md` | Navigation flows for 25 screens |
| `PROTO_SQL.sql` | MySQL schema, triggers, seed data |
| `Planificacion_General.md` | Project progress tracker (read AND update) |

Also read `AGENT.md` (master document with conventions and Definition of Done).

## Common Commands

```bash
# Install dependencies (from root)
npm install

# API ( Terminal 1)
cd apps/api
npm run dev                    # Fastify on :3000 with hot reload

# Mobile (Terminal 2)
cd apps/mobile
npx expo start                 # QR for Expo Go

# Build
npm run build                  # From root, builds all packages

# Lint
npm run lint                   # From root
```

## Architecture

### Monorepo Structure (Turborepo + npm workspaces)

```
apps/
  api/              # Fastify backend
    src/
      modules/      # auth, catalog, cart, checkout, orders, users, wishlist
      middlewares/  # authenticate, adminGuard
      plugins/      # auth.plugin
      config/       # database config
  mobile/           # React Native + Expo
    app/            # Expo Router file-based routing
      (auth)/       # Login, register screens
      (tabs)/       # Home, catalog, cart, orders, profile
      product/      # Product detail
      checkout/     # 4-step checkout flow
      orders/       # Order history
    store/          # Zustand stores
    services/       # API service layer
    hooks/          # Custom React hooks
packages/
  shared/           # Shared TypeScript types
```

### API Module Pattern

Each module in `apps/api/src/modules/<name>/` follows:
- `<name>.routes.ts` - Route definitions
- `<name>.controller.ts` - Request handlers
- `<name>.service.ts` - Business logic
- `<name>.schema.ts` - Zod validation schemas

### Tech Stack Constraints

| Layer | Technology |
|-------|------------|
| Mobile state | Zustand (never Context for business data) |
| API calls | TanStack Query (useQuery/useMutation) |
| Styling | NativeWind (Tailwind classes) |
| Routing | Expo Router (file-based) |
| Animations | Reanimated + Lottie |
| Database IDs | `CHAR(36)` with UUID() - never AUTO_INCREMENT |

### API Response Format

```typescript
// Success
reply.send({ success: true, data: result })

// Error
reply.send({ success: false, error: 'User-friendly message' })

// Protected routes
{ preHandler: [authenticate] }          // Any logged user
{ preHandler: [authenticate, adminGuard] } // Admin only
```

## Critical Business Logic

### Checkout Flow (POST /orders)

Must execute in a single MySQL transaction:

1. Verify cart not empty and not expired
2. Verify stock for EACH variant (409 error if insufficient)
3. Calculate shipping: `base_price + (weight_total * price_per_kg)`
4. Calculate taxes per item using `tax_types.rate`
5. Calculate total: `subtotal + shipping_cost + tax_amount`
6. INSERT orders + order_items
7. UPDATE product_variants SET stock = stock - quantity
8. DELETE cart_items (clear cart)
9. COMMIT
10. Return `{ order_number, total, status }`

### Authentication Flow

```
Login → JWT (1h) + Refresh Token (7d in DB)
   │
   ├── Access Token → Memory (Zustand)
   └── Refresh Token → SecureStore (Expo)

On 401: Try refresh → Re-login if fails
```

### Security Requirements

- Passwords: bcrypt rounds=12
- JWT: secret from `process.env.JWT_SECRET`, expires 1h
- Refresh token: stored in `sessions` table, expires 7d
- Account lockout: 4 failed attempts → 10min lockout (`login_attempts` table)
- Admin role: verify in `adminGuard` middleware, not just frontend
- Payment data: use placeholder/mock (never store real data)

## Visual Identity

- **Background**: `#071327` (dark navy)
- **Surface containers**: `#101b30`, `#142034`, `#2a354a`
- **Primary accent**: `#74b8d3` (cyan)
- **Text**: `#d7e2ff`
- **Secondary text**: `#bfc8cd`

All screens are dark mode only.

## Local Development Environment

```
XAMPP:    localhost → phpMyAdmin: http://localhost/phpmyadmin
Database: kumar_store_proto (import docs/PROTO_SQL.sql)

API:      localhost:3000
  Admin:   admin@kumarstore.com   / Admin2026!
  Client:  cliente@kumarstore.com / Cliente2026!

Mobile:   Expo Go (Android)
  BASE_URL (device): http://<IP-LOCAL>:3000
  BASE_URL (emulator): http://10.0.2.2:3000
```

## Prototype Restrictions

Do NOT implement these (use substitutes instead):

| Feature | Substitute |
|---------|------------|
| Cloudinary | `placehold.co` URLs |
| Real emails | Console.log only |
| Payphone real | Mock successful response |
| Push notifications | Omit completely |
| Google OAuth real | Mock or dev credentials |
| 2FA | Omit |
| SRI electronic invoicing | Simple PDF only |

## Module Completion Status

Completed: Infrastructure, Auth (P01), Catalog (P02), Cart (P03), Checkout (P05), Orders (P05+), Wishlist (P04)
Pending: Profile (P06), Admin (P07), Offline Mode, Animations

Always check `docs/Planificacion_General.md` for current status and update it when completing work.
