# 📦 Módulos del Prototipo — KUMAR Store
**Versión:** PROTO-1.0 | Abril 2026  
**Alcance:** Prototipo local funcional para validación con inversores

---

## Criterio de selección

El prototipo cubre el **flujo principal de compra completo**: desde que un usuario
ingresa a la app hasta que su pedido queda registrado y puede ser gestionado por
el administrador. Toda funcionalidad fuera de este flujo se pospone a v1.0.

---

## MOD-P01 — Autenticación

**Objetivo:** Permitir ingreso a la app con seguridad básica.

### Pantallas
- Login (email + contraseña)
- Registro (2 pasos: datos personales → contraseña + dirección)
- Recuperar contraseña (solicitud de email)
- Vista invitado (navegar catálogo sin sesión)

### Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Login email + contraseña, retorna JWT |
| POST | `/auth/register` | Registro de nuevo cliente |
| POST | `/auth/refresh` | Renovar access token |
| POST | `/auth/logout` | Invalidar refresh token |
| POST | `/auth/forgot-password` | Solicitar email de recuperación |

### Lógica crítica
- Hash bcrypt (rounds 12) en registro
- JWT access token (1h) + refresh token (7d en sesiones DB)
- Bloqueo tras 4 intentos: 10 minutos (tabla `login_attempts`)
- Rol `ADMIN` habilita menú y rutas de administración

---

## MOD-P02 — Catálogo de Productos

**Objetivo:** Mostrar productos navegables con detalle completo.

### Pantallas
- Home: best sellers + en oferta + categorías rápidas
- Listado por categoría con filtros básicos
- Buscador (por nombre)
- Detalle de producto: galería, variantes, stock, relacionados

### Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products` | Listado paginado con filtros query params |
| GET | `/products/:slug` | Detalle del producto por slug |
| GET | `/products/featured` | Best sellers + destacados para Home |
| GET | `/categories` | Árbol de categorías |
| GET | `/products/:id/related` | Productos con etiquetas en común |

### Lógica crítica
- Precio final calculado: `base_price * (1 - discount_percent/100)`
- Stock badge: si `total_stock <= stock_alert_threshold` → "Quedan N disponibles"
- Si `total_stock = 0` → deshabilitar botón de compra
- El stock es la suma de todas las variantes activas del producto

---

## MOD-P03 — Carrito de Compras

**Objetivo:** Gestionar ítems antes del pago con persistencia.

### Pantallas
- Carrito (listado de ítems, resumen, botón checkout)

### Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/cart` | Obtener carrito activo del usuario |
| POST | `/cart/items` | Agregar ítem al carrito |
| PATCH | `/cart/items/:id` | Modificar cantidad |
| DELETE | `/cart/items/:id` | Eliminar ítem |
| DELETE | `/cart` | Vaciar carrito completo |

### Lógica crítica
- Carrito vinculado 1:1 con el usuario (tabla `carts`)
- Persistencia 7 días; trigger MySQL renueva `expires_at` en cada modificación
- `unit_price` se guarda al momento de agregar (detectar cambios posteriores)
- Recalcular total en frontend si `unit_price` difiere del precio actual del producto
- Stock no se reserva en carrito, solo al confirmar pago

---

## MOD-P04 — Wishlist

**Objetivo:** Guardar productos para compra futura.

### Pantallas
- Wishlist (listado de productos guardados)

### Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/wishlist` | Obtener wishlist del usuario |
| POST | `/wishlist/items` | Agregar producto |
| DELETE | `/wishlist/items/:productId` | Quitar producto |

---

## MOD-P05 — Checkout y Pedidos

**Objetivo:** Completar la compra y registrar el pedido.

### Pantallas
- Checkout Paso 1: Selección de dirección
- Checkout Paso 2: Cálculo de envío
- Checkout Paso 3: Selección de método de pago
- Checkout Paso 4: Resumen + confirmación
- Pago exitoso (animación + número de pedido)
- Historial de pedidos del usuario
- Detalle de pedido con timeline de estados

### Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/orders` | Crear pedido desde carrito actual |
| GET | `/orders` | Historial de pedidos del usuario |
| GET | `/orders/:id` | Detalle de un pedido |
| POST | `/orders/:id/cancel` | Cancelar pedido (antes de envío) |
| GET | `/shipping/zones` | Zonas y costos de envío disponibles |
| POST | `/shipping/calculate` | Calcular costo según zona + peso |

### Lógica crítica del checkout (en orden)
1. Validar que el carrito no esté vacío ni expirado
2. Validar stock de cada ítem (puede haber cambiado desde que se agregó)
3. Calcular `shipping_cost` = `base_price + (peso_total * price_per_kg)` de la zona seleccionada
4. Calcular `tax_amount` por ítem según `tax_type_id` del producto
5. Calcular `total` = `subtotal + shipping_cost + tax_amount`
6. Mostrar modal de confirmación con el total final
7. En confirmación:
   - Insertar `orders` + `order_items`
   - Insertar `order_status_history` (trigger automático)
   - **Descontar stock** en `product_variants`
   - Vaciar `cart_items` del carrito
8. Retornar `order_number` para pantalla de éxito

### Generación del número de pedido
```
KUMAR-{AÑO}-{SECUENCIA 5 dígitos}
Ejemplo: KUMAR-2026-00001
```
Implementar con AUTO_INCREMENT en tabla auxiliar o query:
```sql
SELECT CONCAT('KUMAR-', YEAR(NOW()), '-',
  LPAD((SELECT COUNT(*) + 1 FROM orders WHERE YEAR(created_at) = YEAR(NOW())), 5, '0'))
```

---

## MOD-P06 — Perfil de Usuario

**Objetivo:** Gestionar datos personales y direcciones.

### Pantallas
- Ver perfil (nombre, email, teléfono, preferencias)
- Editar perfil
- Mis direcciones (listado + agregar + editar)
- Configuración (dark mode, animación splash)

### Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users/me` | Perfil del usuario autenticado |
| PATCH | `/users/me` | Actualizar datos del perfil |
| GET | `/users/me/addresses` | Listar direcciones |
| POST | `/users/me/addresses` | Agregar dirección |
| PATCH | `/users/me/addresses/:id` | Editar dirección |
| DELETE | `/users/me/addresses/:id` | Eliminar dirección |
| PATCH | `/users/me/addresses/:id/default` | Marcar como predeterminada |

---

## MOD-P07 — Panel de Administración

**Objetivo:** Gestión básica de productos y pedidos para el admin.

### Pantallas
- Dashboard: métricas básicas (ventas, pedidos pendientes, stock crítico)
- Listado de productos con acciones
- Crear / Editar producto (con variantes)
- Listado de pedidos con filtro por estado
- Detalle de pedido + cambiar estado

### Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/admin/dashboard` | Métricas: ventas hoy/semana/mes, pedidos pendientes |
| GET | `/admin/products` | Listado completo de productos (incluye inactivos) |
| POST | `/admin/products` | Crear producto con variantes |
| PATCH | `/admin/products/:id` | Editar producto |
| DELETE | `/admin/products/:id` | Eliminar / desactivar producto |
| GET | `/admin/orders` | Todos los pedidos con filtros |
| PATCH | `/admin/orders/:id/status` | Actualizar estado del pedido |
| GET | `/admin/inventory` | Productos con stock bajo |
| PATCH | `/admin/variants/:id/stock` | Ajustar stock de variante |

---

## Resumen de pantallas del prototipo

| # | Pantalla | Módulo | Rol |
|---|----------|--------|-----|
| 1 | Splash Screen | — | Todos |
| 2 | Bienvenida / Invitado | P01 | Sin sesión |
| 3 | Login | P01 | Sin sesión |
| 4 | Registro Paso 1 | P01 | Sin sesión |
| 5 | Registro Paso 2 | P01 | Sin sesión |
| 6 | Home | P02 | Cliente |
| 7 | Catálogo / Búsqueda | P02 | Cliente |
| 8 | Detalle de Producto | P02 | Cliente / Invitado |
| 9 | Carrito | P03 | Cliente |
| 10 | Wishlist | P04 | Cliente |
| 11 | Checkout — Dirección | P05 | Cliente |
| 12 | Checkout — Envío | P05 | Cliente |
| 13 | Checkout — Pago | P05 | Cliente |
| 14 | Checkout — Resumen | P05 | Cliente |
| 15 | Pago Exitoso | P05 | Cliente |
| 16 | Historial de Pedidos | P05 | Cliente |
| 17 | Detalle de Pedido | P05 | Cliente |
| 18 | Mi Perfil | P06 | Cliente |
| 19 | Mis Direcciones | P06 | Cliente |
| 20 | Configuración | P06 | Cliente |
| 21 | Dashboard Admin | P07 | Admin |
| 22 | Gestión Productos | P07 | Admin |
| 23 | Crear/Editar Producto | P07 | Admin |
| 24 | Gestión Pedidos | P07 | Admin |
| 25 | Detalle Pedido Admin | P07 | Admin |
