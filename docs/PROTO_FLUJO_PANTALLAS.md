# 📱 Flujo de Pantallas — Prototipo KUMAR Store
**Versión:** PROTO-1.0 | Abril 2026

---

## 1. Flujo General del Sistema

```
                    ┌─────────────────┐
                    │  Splash Screen   │
                    │  (SCR-01)        │
                    └────────┬────────┘
                             │
              ┌──────────────▼──────────────┐
              │    ¿Tiene sesión activa?     │
              └──────┬──────────────┬───────┘
                    No              Sí
                     │              │
          ┌──────────▼──┐    ┌──────▼──────────────────┐
          │  Bienvenida  │    │     HOME (Tab Principal) │
          │  (SCR-02)    │    │     (SCR-06)             │
          └──────┬───────┘    └──────────────────────────┘
                 │
     ┌───────────┼────────────────┐
     │           │                │
┌────▼────┐ ┌───▼────┐  ┌────────▼──────┐
│  Login  │ │Registro│  │ Ver Catálogo  │
│ (SCR-03)│ │(SCR-04)│  │ Como Invitado │
└────┬────┘ └───┬────┘  └───────────────┘
     │          │
     └────┬─────┘
          │ (Autenticado)
          ▼
   ┌─────────────────────────────────────────┐
   │          NAVEGACIÓN PRINCIPAL           │
   │  Home | Catálogo | Carrito | Pedidos | Perfil │
   │                 (Tabs)                  │
   └─────────────────────────────────────────┘
```

---

## 2. Flujo de Autenticación

```
[SCR-02 Bienvenida]
  ├─→ "Iniciar Sesión"         → [SCR-03 Login]
  ├─→ "Crear Cuenta"           → [SCR-04a Registro P1]
  └─→ "Explorar como invitado" → [SCR-06 Home — modo solo lectura]

[SCR-03 Login]
  ├─→ Credenciales OK          → [SCR-06 Home]
  ├─→ Error: 1-3 intentos      → Mensaje "N intentos restantes"
  ├─→ Error: 4 intentos        → "Cuenta bloqueada 10 minutos"
  ├─→ "Olvidé contraseña"      → [SCR-05 Recuperar Contraseña]
  └─→ "Crear cuenta"           → [SCR-04a Registro P1]

[SCR-04a Registro — Paso 1: Datos personales]
  └─→ "Siguiente" (válido)     → [SCR-04b Registro — Paso 2]

[SCR-04b Registro — Paso 2: Contraseña + Dirección]
  └─→ "Crear Cuenta" (válido)  → [SCR-06 Home] (auto-login)

[SCR-05 Recuperar Contraseña]
  └─→ "Enviar enlace"          → Toast "Revisa tu email" → [SCR-03 Login]
```

---

## 3. Flujo del Catálogo

```
[SCR-06 Home]
  ├─→ Tap categoría (chip rápido)   → [SCR-07 Catálogo filtrado]
  ├─→ Tap buscador                  → [SCR-07 Catálogo con búsqueda]
  ├─→ Tap product card (best seller/oferta) → [SCR-08 Detalle Producto]
  └─→ Tap ♡ en card                 → Agrega a Wishlist (toast feedback)

[SCR-07 Catálogo / Búsqueda]
  ├─→ Buscar texto                  → Filtra resultados en tiempo real
  ├─→ Tap "Filtros" (bottom sheet)  → Seleccionar filtros → Aplicar
  ├─→ Tap product card              → [SCR-08 Detalle Producto]
  └─→ Tap ♡ en card                 → Agrega a Wishlist

[SCR-08 Detalle de Producto]
  ├─→ Swipe imágenes                → Navegar galería
  ├─→ Tap ♡ (wishlist)              → Toggle wishlist
  ├─→ Seleccionar variante          → Actualiza precio/stock mostrado
  ├─→ "AGREGAR AL CARRITO"          → Animación → Toast → Badge carrito ++
  ├─→ Botón compartir               → Sheet compartir (copiar enlace)
  ├─→ Scroll a "relacionados"       → [SCR-08 otro producto]
  └─→ Si stock = 0                  → Botón deshabilitado "No disponible"

INVITADO intenta agregar al carrito:
  └─→ Modal "Para comprar debes tener una cuenta" →
      [Iniciar sesión] o [Crear cuenta]
```

---

## 4. Flujo del Carrito

```
[Tab Carrito — SCR-09]
  Estado vacío:
    └─→ Ilustración vacía + "Explora nuestros productos" → [SCR-07]

  Con ítems:
    ├─→ Tap "+" / "-"              → Actualiza cantidad (PATCH /cart/items)
    ├─→ Swipe ítem izquierda       → Eliminar ítem (confirm) → DELETE
    ├─→ Ícono papelera ítem        → Eliminar ítem
    ├─→ Advertencia precio cambió  → Badge "Precio actualizado"
    ├─→ Advertencia stock bajo     → Badge "⚠️ Stock limitado"
    └─→ "PROCEDER AL PAGO"         → [SCR-10 Checkout — Dirección]
                                     (Requiere auth. Si invitado → Login)
```

---

## 5. Flujo Completo de Checkout (Flujo Principal)

```
[SCR-10 Checkout — Paso 1: Dirección]
  Progreso: ●○○○

  ├─→ Seleccionar dirección guardada  → siguiente habilitado
  ├─→ "Usar mi ubicación GPS"         → detectar zona → seleccionar
  ├─→ "+ Añadir nueva dirección"      → form inline o modal
  └─→ "SIGUIENTE" (dirección elegida) → [SCR-11 Envío]

        │ (Si no tiene direcciones guardadas)
        └─→ Forzar añadir dirección antes de continuar

[SCR-11 Checkout — Paso 2: Envío]
  Progreso: ●●○○

  Muestra:
    - Zona detectada según dirección seleccionada
    - Costo de envío calculado (base + peso total del carrito)
    - ETA estimada (ej: "Entrega estimada: 1-2 días hábiles")

  └─→ "SIGUIENTE" → [SCR-12 Pago]

[SCR-12 Checkout — Paso 3: Método de Pago]
  Progreso: ●●●○

  Opciones (radio buttons):
    - 💳 Tarjeta de crédito/débito  → Ingresar datos
    - 🏦 Transferencia bancaria     → Mostrar datos bancarios KUMAR
    - 🤝 Pago contra entrega        → Sin datos adicionales
    - 📱 Payphone                   → Número de teléfono

  └─→ "SIGUIENTE" (método elegido) → [SCR-13 Resumen]

[SCR-13 Checkout — Paso 4: Resumen]
  Progreso: ●●●●

  Muestra:
    - 📍 Dirección de entrega
    - 🚚 Método de envío + costo
    - 🛍️ Lista de productos (con variantes)
    - 💰 Subtotal / IVA / Envío / TOTAL
    - Método de pago seleccionado

  └─→ "CONFIRMAR Y PAGAR $XX.XX"
        │
        ▼
      Modal de confirmación:
      "¿Confirmas esta compra?"
      Total: $XX.XX
      [Cancelar]  [Confirmar]
        │
        ├─→ Cancelar → Volver a SCR-13
        └─→ Confirmar → POST /orders → Procesar
              │
              ├─→ OK    → [SCR-14 Pago Exitoso]
              └─→ Error → Modal "Error al procesar, intenta de nuevo"

[SCR-14 Pago Exitoso]
  - Animación Lottie checkmark (2s)
  - "¡Pedido confirmado!"
  - Número: #KUMAR-2026-00001
  - "Recibirás actualizaciones por email"
  - [Ver mi pedido] → [SCR-16 Detalle Pedido]
  - [Seguir comprando] → [SCR-06 Home]
```

---

## 6. Flujo de Pedidos

```
[Tab Pedidos — SCR-15 Historial]
  Estado vacío:
    └─→ "Aún no tienes pedidos" + botón "Ir a comprar" → [SCR-06 Home]

  Con pedidos:
    ├─→ Filtrar por estado (tabs: Todos / Activos / Completados)
    └─→ Tap en pedido → [SCR-16 Detalle de Pedido]

[SCR-16 Detalle de Pedido]
  Secciones:
    1. Header: Número + estado (badge color) + fecha
    2. Timeline de estados (vertical, con fechas)
    3. Productos comprados (con imagen + variante + cantidad)
    4. Dirección de entrega
    5. Método de pago
    6. Desglose: subtotal / IVA / envío / total

  Acciones según estado:
    - PENDIENTE_PAGO   → [Cancelar pedido] (confirm modal)
    - PAGO_CONFIRMADO  → Solo informativo
    - ENVIADO          → Solo informativo
    - EN_CAMINO        → Solo informativo
    - ENTREGADO        → [Dejar reseña] (si no ha reseñado)
    - CANCELADO        → Solo informativo
```

---

## 7. Flujo del Perfil

```
[Tab Perfil — SCR-17]
  ├─→ "Editar perfil"         → [SCR-18 Editar Perfil]
  ├─→ "Mis direcciones"       → [SCR-19 Direcciones]
  ├─→ "Mis pedidos"           → [SCR-15 Historial]
  ├─→ "Wishlist"              → [SCR-20 Wishlist]
  ├─→ "Configuración"         → [SCR-21 Configuración]
  ├─→ "Centro de ayuda"       → [FAQ lista]
  └─→ "Cerrar sesión"         → Modal confirm → [SCR-02 Bienvenida]

[SCR-19 Mis Direcciones]
  ├─→ Tap dirección           → Marcar como predeterminada
  ├─→ Tap editar (ícono)      → Form editar dirección
  ├─→ Tap eliminar (ícono)    → Confirm → Eliminar
  └─→ "+ Agregar dirección"   → Form nueva dirección

[SCR-21 Configuración]
  ├─→ Toggle Dark Mode        → Cambia tema de la app inmediatamente
  └─→ Toggle Animación Splash → Habilita/deshabilita animación de carga
```

---

## 8. Flujo del Panel Admin

```
[Tab Admin — SCR-22 Dashboard]
  Solo visible para usuarios con role = 'ADMIN'

  ├─→ Card "Pedidos pendientes" → [SCR-25 Gestión Pedidos filtrado]
  ├─→ Card "Stock crítico"      → [SCR-23 Productos filtrado por stock bajo]
  ├─→ Tap en pedido de lista    → [SCR-26 Detalle Pedido Admin]
  └─→ Nav Admin: [Productos] [Pedidos] [Configuración]

[SCR-23 Gestión de Productos]
  ├─→ Tap producto              → [SCR-24 Editar Producto]
  ├─→ Toggle activo/inactivo    → Actualiza en API
  ├─→ "+" FAB botón             → [SCR-24 Crear Producto]
  └─→ Búsqueda / filtro         → Filtra lista

[SCR-24 Crear / Editar Producto]
  Secciones del form:
    1. Datos básicos (nombre, SKU, descripción)
    2. Precio y descuento
    3. Categoría e IVA
    4. Imágenes (hasta 5 URLs en prototipo)
    5. Variantes (lista editable)
    6. Umbral de alerta de stock
    7. Flags (destacado, best seller, activo)

  └─→ Guardar → POST/PATCH /admin/products → Volver a SCR-23

[SCR-25 Gestión de Pedidos]
  ├─→ Filtrar por estado (chips)
  ├─→ Tap pedido                → [SCR-26 Detalle Pedido Admin]
  └─→ Cambiar estado inline     → Dropdown estado → Confirm → PATCH

[SCR-26 Detalle de Pedido (Admin)]
  Igual que SCR-16 + acciones admin:
    └─→ Dropdown "Cambiar estado" → Seleccionar nuevo estado →
        Confirm → PATCH /admin/orders/:id/status
        → Toast "Estado actualizado" → Actualiza timeline
```

---

## 9. Mapa de Navegación por Tabs

```
Root Navigator
│
├── (auth) — Sin autenticación
│   ├── /login
│   ├── /register
│   └── /forgot-password
│
├── (guest) — Sin autenticación, solo lectura
│   └── /product/[slug]
│
└── (tabs) — Requiere autenticación
    ├── / (Home)
    ├── /catalog
    ├── /cart         ← Badge con conteo de ítems
    ├── /orders
    ├── /profile
    │
    ├── /product/[slug]    ← Stack sobre tabs
    ├── /checkout/*        ← Stack sobre tabs
    ├── /orders/[id]       ← Stack sobre tabs
    ├── /profile/*         ← Stack sobre tabs
    │
    └── /admin/*     ← Solo si role = ADMIN (guard)
        ├── /admin
        ├── /admin/products
        ├── /admin/products/[id]
        ├── /admin/orders
        └── /admin/orders/[id]
```

---

## 10. Reglas de Navegación Importantes

| Situación | Comportamiento |
|-----------|----------------|
| Usuario no autenticado intenta ir a `/cart` | Redirigir a `/login` |
| Usuario no autenticado intenta hacer checkout | Modal login antes de continuar |
| Usuario con rol CLIENTE intenta ir a `/admin` | Redirigir a `/` (Home) |
| Token expirado en cualquier pantalla | Intentar refresh → si falla → `/login` |
| Carrito vacío en tab Carrito | Mostrar empty state, no redirigir |
| Pedido exitoso: botón "back" | Limpiar historial de navegación checkout |
