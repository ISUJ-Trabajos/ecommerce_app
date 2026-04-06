---
trigger: always_on
---

# KUMAR Store — Reglas del Agente IA (Gemini / Antigravity)

## 1. Lectura obligatoria antes de escribir código

Al iniciar cada sesión o tarea, el agente **DEBE** leer y analizar los siguientes
archivos en el orden indicado. No omitir ninguno aunque el agente crea conocer el contenido.

```
docs/PROTO_MODULOS.md          → Módulos, endpoints, lógica crítica por módulo
docs/PROTO_ARQUITECTURA.md     → Estructura de carpetas, variables de entorno, dependencias
docs/PROTO_FLUJO_PANTALLAS.md  → Navegación entre las 25 pantallas del prototipo
docs/PROTO_SQL.sql             → Esquema MySQL, triggers, datos semilla, usuarios de prueba
docs/Kumar_Store.png           → Referencia visual del logo (identidad de marca)
docs/Planificacion_General.md  → Planificación activa del proyecto (leer Y actualizar)
AGENT.md                       → Documento maestro de reglas y convenciones del proyecto
```

**Regla de oro:** Si el agente no ha leído estos archivos en la sesión actual,
debe leerlos antes de generar cualquier archivo, función o migración.

---

## 2. Identidad visual y marca

- **Dark mode**: interfaz principal en fondo `#071327` (azul marino oscuro).
- **Acento**: celeste `#74b8d3`.
- Todas las pantallas y componentes deben respetar esta paleta.
- El logo de referencia está en `docs/Kumar_Store.png`; usarlo para el splash y headers.
- Las referencias visuales de pantallas se obtienen del proyecto **"KUMAR Store E-commerce"**
  en el servidor MCP de Stitch AI. Consultar antes de maquetar cualquier pantalla.

---

## 3. Stack tecnológico — respetar sin excepciones

| Capa | Tecnología |
|------|-----------|
| App móvil | React Native + Expo (Expo Router, template blank TypeScript) |
| Estado global | **Zustand** (nunca Context API para datos de negocio) |
| Llamadas API | **TanStack Query** (`useQuery` / `useMutation`) |
| Estilos | **NativeWind** (clases Tailwind) |
| API backend | **Fastify** + `mysql2` + JWT |
| Base de datos | **MySQL** en XAMPP (importar `docs/PROTO_SQL.sql`) |
| IDs en BD | `CHAR(36)` con `UUID()` — **nunca** `AUTO_INCREMENT` para IDs de negocio |
| Animaciones | **Reanimated** (splash, botón carrito) + **Lottie** (checkmark pago) |
| Offline | `@react-native-community/netinfo` + caché TanStack Query + AsyncStorage |

---

## 4. Convenciones de código

### 4.1 API (Fastify)
```typescript
// Respuesta estándar — siempre
reply.send({ success: true,  data: result })
reply.send({ success: false, error: 'Mensaje legible para el usuario' })

// Rutas protegidas
{ preHandler: [authenticate] }               // Cualquier usuario logueado
{ preHandler: [authenticate, adminGuard] }   // Solo ADMIN
```

### 4.2 Mobile (React Native)
```typescript
// Llamadas API — siempre TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['products', filters],
  queryFn:  () => ProductsService.getAll(filters),
})

// Estado global — Zustand
const { cart, addItem } = useCartStore()
```

### 4.3 Base de datos
```sql
-- IDs: CHAR(36) con UUID()
-- No duplicar lógica que ya tienen los triggers de PROTO_SQL.sql
-- Usar transacciones en operaciones multi-tabla (especialmente checkout)
```

---

## 5. Flujo de checkout — lógica obligatoria

El endpoint `POST /orders` **debe** ejecutar en una sola transacción MySQL:

1. Verificar carrito no vacío y no expirado
2. Verificar stock de cada variante (error 409 si falta stock, con detalle)
3. Calcular `shipping_cost`: `base_price + (peso_total * price_per_kg)`
4. Calcular `tax_amount` por ítem según `tax_types.rate`
5. Calcular `total = subtotal + shipping_cost + tax_amount`
6. `INSERT` en `orders` y `order_items`
7. `UPDATE product_variants SET stock = stock - quantity`
8. `DELETE` de `cart_items`
9. `COMMIT`
10. Retornar `{ order_number, total, status }`

---

## 6. Seguridad mínima del prototipo

- Contraseñas: **bcrypt rounds=12**
- JWT: secret desde `process.env.JWT_SECRET`, expiración **1h**
- Refresh token: tabla `sessions`, expiración **7d**
- Bloqueo de cuenta: 4 intentos fallidos → bloqueo 10 min (tabla `login_attempts`)
- Rol ADMIN: verificar en middleware `adminGuard`, no solo en frontend
- Datos de pago: **NO almacenar** — usar string placeholder/mock

---

## 7. Restricciones del prototipo (no implementar)

| Feature | Sustituto |
|---------|-----------|
| Cloudinary | URLs de `placehold.co` |
| Emails reales | `console.log` en API |
| Payphone real | Mock de respuesta exitosa |
| Push notifications | Omitir completamente |
| Google OAuth real | Mock o credenciales propias de dev |
| 2FA | Omitir |
| SRI factura electrónica | PDF simple sin integración SRI |

---

## 8. Gestión del archivo de planificación

- El archivo `docs/Planificacion_General.md` es la **fuente de verdad** del progreso.
- El agente debe **leerlo al inicio** de cada tarea y **actualizarlo al finalizar**.
- Cada módulo completado se marca con `[x]`.
- Si se detecta una desviación respecto al plan, se registra en la sección
  `## Notas y Desviaciones` del archivo.
- El agente **nunca** omite este paso de actualización.

---

## 9. Pruebas unitarias por módulo

Cada módulo debe incluir un archivo de pruebas mínimas que verifiquen:

1. **Conexión a la BD**: query simple que retorne al menos un registro.
2. **Respuesta del endpoint principal**: status 200/201 y estructura `{ success, data }`.
3. **Guard de autenticación**: endpoint protegido retorna 401 sin token.
4. **Caso de error conocido**: p. ej. checkout con stock 0 retorna 409.

Ubicación sugerida: `apps/api/src/modules/<modulo>/__tests__/<modulo>.test.ts`

---

## 10. Orden de desarrollo recomendado

```
1. Infraestructura base (BD, API boilerplate, autenticación JWT)
2. P01 Auth        — Login, registro, sesión
3. P02 Catálogo    — Home, listado, detalle, variantes
4. P03 Carrito     — Persistencia, cantidades, resumen
5. P05 Checkout    — 4 pasos + pedido en BD
6. P05+ Pedidos    — Historial + timeline
7. P04 Wishlist    — Guardar/quitar productos
8. P06 Perfil      — Datos, direcciones, config
9. P07 Admin       — Dashboard, productos, pedidos
10. Offline mode   — Banner, caché catálogo
11. Animaciones    — Splash, carrito, checkmark Lottie
```

---

## 11. Entorno local de referencia

```
XAMPP:  localhost  →  phpMyAdmin: http://localhost/phpmyadmin
BD:     kumar_store_proto  (importar docs/PROTO_SQL.sql)

API:    localhost:3000
  Admin:    admin@kumarstore.com   / Admin2026!
  Cliente:  cliente@kumarstore.com / Cliente2026!

App:    Expo Go (Android)
  BASE_URL (dispositivo): http://<IP-LOCAL>:3000
  BASE_URL (emulador):    http://10.0.2.2:3000
```

---

*Última actualización: generado desde AGENT.md — KUMAR Store Prototype*