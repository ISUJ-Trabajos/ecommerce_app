# AGENT.md — KUMAR Store Prototype

## Contexto del Proyecto

**KUMAR Store** es una app móvil e-commerce para Ecuador (Quito). Vende productos físicos:
Moda, Cosméticos/Salud, Hogar/Decoración y Accesorios. Tienda propia, único vendedor.
Identidad visual: dark mode, azul marino `#071327`, acento celeste `#74b8d3`.

Este repositorio es el **prototipo local** para validación con inversores. Monorepo con
app React Native (Expo) + API Fastify + BD MySQL en XAMPP.

---

## Documentos de Referencia

Antes de escribir código, lee estos archivos en `docs/`:

| Archivo | Contenido |
|---------|-----------|
| `PROTO_MODULOS.md` | 7 módulos del prototipo, endpoints por módulo, lógica crítica |
| `PROTO_ARQUITECTURA.md` | Estructura completa de carpetas, variables de entorno, dependencias |
| `PROTO_FLUJO_PANTALLAS.md` | Flujos de navegación entre las 25 pantallas del prototipo |
| `PROTO_SQL.sql` | Script MySQL para XAMPP, incluye datos semilla y usuarios de prueba |
| `Kumar_Store.png` | Imagen de referencia visual del logo de la empresa |

En este proyecto dentro de la carpeta docs/ crea el documento Planificacion_General.md con el que se contendrá y modificará la planificación del proyecto para saber el progreso y pasos a seguir dentro del desarrollo del prototipo.

---

## Referencia Visual — Pantallas

Las pantallas de referencia visual fueron generadas con los colores y estructura
de KUMAR Store. Para la referencia y uso dentro de la app, abre y analiza el proyecto con el servidor MCP de Stitch AI para buscar el proyecto con nombre "KUMAR Store E-commerce".

---

## Entorno Local

```
XAMPP: Apache + MySQL corriendo en localhost
  phpMyAdmin: http://localhost/phpmyadmin
  BD: kumar_store_proto (importar docs/PROTO_SQL.sql)

API: Node.js + Fastify en localhost:3000
  Credenciales de prueba:
    Admin:   admin@kumarstore.com   / Admin2026!
    Cliente: cliente@kumarstore.com / Cliente2026!

App móvil: Expo Go en dispositivo Android
  BASE_URL: http://<IP-LOCAL>:3000  (misma red WiFi)
  Emulador: http://10.0.2.2:3000
```

---

## Estructura del Monorepo

```
ecommerce_app/           → Carpeta principal del proyecto
├── apps/mobile/         → React Native + Expo (Expo Router - Iniciar proyecto con npx expo start template-blank-typescript)
├── apps/api/            → Fastify + mysql2 + JWT
├── packages/shared/     → Tipos TypeScript compartidos
└── docs/                → Documentación y script SQL BD Proto
```

Ver estructura detallada en `docs/PROTO_ARQUITECTURA.md`.

---

## Módulos del Prototipo (Prioridad)

| Módulo | Descripción | Pantallas |
|--------|-------------|-----------|
| P01 Auth | Login email/Google, registro, sesión JWT | SCR-02→05 |
| P02 Catálogo | Home, listado, detalle, variantes, stock | SCR-06→08 |
| P03 Carrito | Persistencia 7d, cantidad, resumen | SCR-09 |
| P04 Wishlist | Guardar/quitar productos | SCR-20 |
| P05 Checkout | 4 pasos + confirmación + success | SCR-10→14 |
| P05+ Pedidos | Historial + detalle + timeline | SCR-15→16 |
| P06 Perfil | Datos + direcciones + config | SCR-17→21 |
| P07 Admin | Dashboard + productos + pedidos | SCR-22→26 |

Detalle completo de endpoints y lógica en `docs/PROTO_MODULOS.md`.

---

## Convenciones de Código

### API (Fastify)
```typescript
// Respuesta estándar — usar siempre
reply.send({ success: true, data: result })
reply.send({ success: false, error: 'Mensaje legible para el usuario' })

// Rutas protegidas — usar preHandler
{ preHandler: [authenticate] }          // Cualquier usuario logueado
{ preHandler: [authenticate, adminGuard] }  // Solo ADMIN
```

### Mobile (React Native)
```typescript
// Llamadas API — siempre con TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => ProductsService.getAll(filters),
})

// Estado global — Zustand (no Context para datos de negocio)
const { cart, addItem } = useCartStore()

// Estilos — NativeWind (Tailwind)
// Colores de marca vía className o StyleSheet con colors.*
```

### Base de Datos
```sql
-- MySQL: IDs como CHAR(36) con UUID()
-- Nunca AUTO_INCREMENT para IDs de negocio
-- Triggers ya definidos en PROTO_SQL.sql (no duplicar lógica en API)
-- Usar transacciones en operaciones multi-tabla (checkout)
```

---

## Flujo de Checkout — Lógica Crítica

Al ejecutar `POST /orders` el API debe (en transacción):

```
1. Verificar carrito no vacío y no expirado
2. Verificar stock de CADA variante en el carrito
   → Si alguna sin stock: error 409 con detalle
3. Calcular shipping_cost: base_price + (peso_total * price_per_kg)
4. Calcular tax_amount por ítem según tax_types.rate
5. Calcular total = subtotal + shipping_cost + tax_amount
6. INSERT orders + order_items
7. UPDATE product_variants SET stock = stock - quantity (por cada ítem)
8. DELETE cart_items (vaciar carrito)
9. COMMIT
10. Retornar { order_number, total, status }
```

Ver flujo completo en `docs/PROTO_FLUJO_PANTALLAS.md §5`.

---

## Seguridad — Mínimo para Prototipo

- Contraseñas: bcrypt rounds=12
- JWT: secret desde `process.env.JWT_SECRET`, expiración 1h
- Refresh token: guardado en tabla `sessions`, expiración 7d
- Bloqueo: 4 intentos fallidos → bloqueo 10min (tabla `login_attempts`)
- Rol ADMIN: verificar en `adminGuard` middleware, no solo en frontend
- Datos sensibles de pago: NO almacenar en prototipo (simular con string placeholder)

---

## Modo Offline (Mínimo para Prototipo)

```typescript
// hooks/useOffline.ts — detectar estado de red
import NetInfo from '@react-native-community/netinfo'

// Al detectar sin conexión:
// 1. Mostrar OfflineBanner (rojo) con texto "Sin conexión a internet"
// 2. Servir catálogo desde AsyncStorage/cache de TanStack Query
// 3. Bloquear checkout con mensaje apropiado
// Al reconectar:
// 1. Banner verde "Vuelves a tener conexión" (3 segundos)
// 2. Invalidar queries: queryClient.invalidateQueries()
```

---

## Animaciones Requeridas

| Animación | Pantalla | Implementación |
|-----------|----------|----------------|
| Splash fade-in logo | SCR-01 | Reanimated `FadeIn` |
| Agregar al carrito | SCR-08 botón | Reanimated `useAnimatedStyle` escala |
| Checkmark pago exitoso | SCR-14 | Lottie JSON (buscar free asset) |
| Transiciones de pantalla | Global | React Navigation (por defecto) |

---

## Comandos Frecuentes

```bash
# Desde raíz del monorepo
npm install                          # Instalar todas las deps

# Terminal 1 — API
cd apps/api
npm run dev                          # Fastify en :3000 con hot reload

# Terminal 2 — App móvil  
cd apps/mobile
npx expo start                       # QR para Expo Go

# Verificar BD
# Abrir http://localhost/phpmyadmin → kumar_store_proto

# Reset BD (si necesario)
# En phpMyAdmin: DROP DATABASE → reimportar docs/PROTO_SQL.sql
```

---

## Restricciones del Prototipo

- Sin Cloudinary: usar URLs de `placehold.co` para imágenes
- Sin emails reales: loguear en consola en lugar de enviar
- Sin Payphone real: simular respuesta exitosa con mock
- Sin push notifications: omitir completamente
- Sin Google OAuth real en dev: puede usar mock o configurar credenciales propias
- Sin 2FA: omitir en prototipo
- La factura electrónica SRI: generar PDF simple, no integrar SRI

---

## Definición de Terminado (DoD) — Prototipo

El prototipo está completo cuando:

- [ ] Usuario puede registrarse e iniciar sesión
- [ ] Catálogo muestra productos con variantes y stock
- [ ] Se puede agregar al carrito y ver resumen con totales correctos
- [ ] Flujo de checkout completo (4 pasos) genera un pedido en la BD
- [ ] Pantalla de éxito muestra número de pedido
- [ ] Historial de pedidos lista los pedidos del usuario
- [ ] Admin puede ver pedidos y cambiar su estado
- [ ] Admin puede crear/editar productos con variantes
- [ ] Stock se descuenta al confirmar pedido
- [ ] La app funciona sin conexión (solo visualización del catálogo cacheado)
