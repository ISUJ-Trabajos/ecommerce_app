# Guía de Pruebas y Ejecución — KUMAR Store (Fases 1 a 7)

Esta guía documenta los pasos necesarios para levantar el entorno de desarrollo local y verificar de forma estructurada todas las funcionalidades implementadas hasta la **Fase 7 (Wishlist)**.

---

## 1. Preparación del Entorno (Servicios Base)

Para que la aplicación funcione correctamente, los 3 pilares del proyecto deben estar ejecutándose en paralelo.

### A. Base de Datos (MySQL)
1. Abre **XAMPP Control Panel**.
2. Inicia los servicios de **Apache** y **MySQL**.
3. Asegúrate de que MySQL esté corriendo en el puerto por defecto (`3306`).
4. *(Opcional)* Si hay errores de datos, puedes reiniciar la base de datos importando de nuevo el archivo fuente:
   - Abre `http://localhost/phpmyadmin`
   - Selecciona la base de datos `kumar_store_proto` (o créala si la eliminaste).
   - Importa el archivo `docs/PROTO_SQL.sql` que se encuentra en la raíz del proyecto.

### B. Ejecución del Backend (API Fastify)
El backend actúa como la capa central para reglas de negocio y validación.
1. Abre una nueva terminal en VS Code y navega al directorio de la API:
   ```bash
   cd apps/api
   ```
2. Instala dependencias (si no lo has hecho):
   ```bash
   npm install
   ```
3. Ejecuta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
4. Verificación: Deberías ver en la terminal que el servidor escucha en `http://localhost:3000`. Puedes abrir `http://localhost:3000/health` en el navegador para confirmar que la API responde.

### C. Ejecución del Frontend Móvil (Expo)
1. Abre una **segunda** terminal en VS Code y navega al directorio móvil:
   ```bash
   cd apps/mobile
   ```
2. Instala dependencias (si aplica):
   ```bash
   npm install
   ```
3. Verifica qué IP o host apuntar el backend:
   Asegúrate que en el archivo `apps/mobile/services/api.client.ts`, la variable `BASE_URL` apunte correctamente:
   - Si usas el emulador de Android: `http://10.0.2.2:3000`
   - Si usas la app de Expo Go en tu celular físico: La dirección IP de tu computadora (ej: `http://192.168.1.X:3000`).
4. Levanta Expo:
   ```bash
   npx expo start -c
   ```
   *(El flag `-c` limpia la caché, útil si has realizado cambios drásticos)*.
5. Inicia el simulador presionando `a` (Android) o escanea el código QR con Expo Go en tu celular.

---

## 2. Flujos de Verificación (Pruebas de Usuario)

Si todo está ejecutándose, prosigue con la validación de los módulos completados siguiendo este orden:

### Prueba de Autenticación (Fase 2)
1. **Registro:** En la pantalla de Login, presiona "Crear Cuenta". Ingresa un correo falso (`test@correo.com`), una clave, tu nombre completo y teléfono. Si funciona, la app te logueará directamente.
2. Si prefieres usar una cuenta de prueba ya pre-cargada desde el SQL:
   - **User:** `cliente@kumarstore.com`
   - **Clave:** `Cliente2026!`

### Prueba de Catálogo y Navegación (Fases 1, 3)
1. **Home:** Deberías ver un saldo visual con tarjetas apiladas horizonalmente ("Destacados" y "Más Vendidos").
2. **Bottom Tabs:** Verifica que los iconos de la barra inferior cambien suavemente de color activo (celeste).
3. **Catálogo Integrado:** Dirígete a la pestaña (🔍 Catálogo). Escribe el nombre de un zapato o abrigo en la caja de búsqueda. Los resultados deben reaccionar progresivamente (Debounce).
4. Elige un producto presionando sobre su tarjeta para acceder a la **Pantalla de Detalle**.

### Prueba de Wishlist - Favs (Fase 7)
1. **Corazón Rápido:** Dentro del "Catálogo" o el "Home", haz clic en el mini-corazón situado en la esquina de la foto de cualquier gorra o camiseta. Se rellenará de rojo al instante.
2. **Central Wishlist:** Dirígete a la pestaña "♡ Favoritos". Tu prenda guardada debe estar ahí, demostrando persistencia en la API MySQL.
3. Intenta removerlo dando clic al botón gris "X" situado en la barra de control derecha. Desaparecerá de inmediato.

### Prueba de Carrito In-Memory / BD (Fase 4)
1. Ve al "Detalle de Producto" de algún otro ítem.
2. Si la prenda tiene variantes (ej: tallas o colores), escoge una. (Los botones de la variante se resaltarán).
3. Presiona **Añadir al Carrito**. Un *toast* invisible o una transición visual reflejará el cambio. Observa el carrito global que vive en el `Header` superior de la App. ¡Su contador `[1]` o `[2]` debe incrementarse!.
4. Presiona el botón del Carrito Global. Te dirigirá a la vista detallada de sumas y restas de items. Añade un "Item extra" con el botón `+`. El subtotal se re-calculará de forma global.

### Prueba Maestra: Checkout Atómico (Fase 5)
Este es el flujo crítico técnico y financiero. Dentro del Carrito de la prueba anterior:
1. Dale al botón amarillo o celeste "Proceder al Pago".
2. **Step 1 - Dirección:** Verás tus locaciones. Selecciona tu casa o, para mayor reto, presiona "Nueva Dirección", ingresa calle falsa y dale a guardar. Se seleccionará sola.
3. **Step 2 - Logística:** Identifica hacia dónde enviar, y confirma. Te indicará el costo adicional sumado a tu factura.
4. **Step 3 - Pago:** En este prototipo simularemos Pago a Contra Entrega o "Payphone".
5. **Step 4 - Control (Resumen Definitivo):** Verás el comprobante con los costos y el botón rojo de "Pagar Ahora". Presiónalo.
6. **Éxito (Lottie):** Presenciarás una animación de Check Mark Vectorial fluida en verde indicando "Tu pedido ha sido procesado". (La Base de Datos atómicamente redujo el "Stock" general y borró tu carrito).

### Prueba Final: Historial de Pedidos y Timeline (Fase 6)
Terminada tu transacción y compra:
1. Asegúrate de volver al inicio tras ver el Check animado.
2. Dirígete a la pestaña móvil "👤 Perfil".
3. Toca en la nueva sección que agregamos: **"Mis Pedidos"**.
4. ¡Allá está! Una boleta con tu número de orden única (Ej: K-#1902) recién facturada.
5. Haz tap sobre la misma. Verás el **Timeline Visual**:
   * Tu estado estará marcado de amarrillo (Pendiente de Validación o Pago). El icono del reloj mostrará la fecha real y un Badge "Estado Actual".
   * El resumen inferior mostrará que se asociaron fotos a tu boleta, reflejando persistencia transaccional.

---

*Esta guía está diseñada para replicarse en caso de errores en fases posteriores.*
