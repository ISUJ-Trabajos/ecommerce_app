# Planificación General — Prototipo KUMAR Store
**Versión:** PROTO-1.0 | Abril 2026

Este documento es la **fuente de verdad** del progreso del desarrollo del monorepo (React Native Expo + Fastify API). Cada módulo completado debe marcarse con `[x]`.

---

## Fases de Desarrollo

### 1. Infraestructura Base
- [x] Configuración inicial del monorepo (`turbo.json`, dependencias compartidas).
- [x] Setup de Base de Datos MySQL (importar `PROTO_SQL.sql`).
- [x] Boilerplate API (Fastify + plugins + middlewares + estructura global).
- [x] App Móvil (Expo Router + Zustand + NativeWind + navegación inicial vacía).

### 2. P01 Auth — Login, registro, sesión
- [ ] Endpoint `/auth/register` + `/auth/login` (generación de tokens JWT).
- [ ] Middleware de autenticación global en el backend.
- [ ] Store Zustand para `auth`.
- [ ] UI: Pantallas de Bienvenida, Login, y Registro (Pasos 1 y 2).
- [ ] Implementación de SecureStore para guardar el refresh token.

### 3. P02 Catálogo — Home, listado, detalle, variantes
- [ ] Endpoints de Catálogo (`/products/featured`, `/products`, `/categories`, `/products/:slug`).
- [ ] UI: Home Screen (best sellers, oferta, categorías).
- [ ] UI: Listado de catálogo con búsqueda.
- [ ] UI: Detalle de Producto y selección de variantes (con límite de stock).
- [ ] Hooks Tanstack Query para el flujo de datos.

### 4. P03 Carrito — Persistencia, cantidades, resumen
- [ ] Endpoints de Carrito (`/cart`, items POST/PATCH/DELETE).
- [ ] Store Zustand global del carrito sincronizado con BD.
- [ ] UI: Pantalla Carrito con modales y alertas de precios o stock.

### 5. P05 Checkout — 4 pasos + pedido en BD
- [ ] Endpoints `GET /shipping/zones` y `POST /shipping/calculate`.
- [ ] Transacción crítica `POST /orders` (checkout y lógica atómica mysql detallada en `AGENT.md`).
- [ ] UI: Flujo de 4 pasos (Dirección -> Envío -> Pago -> Resumen).
- [ ] UI: Pantalla de Pago Exitoso.

### 6. P05+ Pedidos — Historial + timeline
- [ ] Endpoints de consulta de Pedidos (`/orders`, `/orders/:id`).
- [ ] UI: Tab de Historial de Pedidos Filtrado.
- [ ] UI: Detalle del pedido con timeline.

### 7. P04 Wishlist — Guardar/quitar productos
- [ ] Endpoints CRUD Wishlist (`/wishlist/items`).
- [ ] UI: Integración botón de corazón "♡" en catálogo y tarjetas.
- [ ] UI: Pantalla lista Wishlist.

### 8. P06 Perfil — Datos, direcciones, config
- [ ] Endpoints de Perfil y Usuarios (`/users/me` y endpoints de direcciones).
- [ ] UI: Tab Perfil, editar datos.
- [ ] UI: CRUD Direcciones desde Settings.
- [ ] Integrar toggles de Tema Oscuro y Animación inicial.

### 9. P07 Admin — Dashboard, productos, pedidos
- [ ] Endpoints Admin limitados por el guard (dashboard, listados y PATCH).
- [ ] UI: Tab de Admin exclusiva y ruteo protegido.
- [ ] UI: Dashboard Admin (Métricas, Pendientes y Stock crítico).
- [ ] UI: Control de Productos y Pedidos (Cambios de status).

### 10. Offline mode — Banner, caché catálogo
- [ ] Hook `useOffline` detectando `@react-native-community/netinfo`.
- [ ] Global Banner de error "Sin conexión".
- [ ] Caché persistente de TanStack Query para que la app lea listados offline.

### 11. Animaciones — Splash, carrito, checkmark Lottie
- [ ] Splash screen con `react-native-reanimated`.
- [ ] Animación para sumar ítems al carrito (Micro interacciones).
- [ ] Lottie file animation de pago y checkmark verde en Pantalla Exitoso.

---

## Notas y Desviaciones
*(Agente: Documenta aquí debajo cambios respecto a la arquitectura original cuando apliquen, según la regla 8 de `AGENT.md`)*
