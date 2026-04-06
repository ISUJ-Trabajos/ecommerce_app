# Mejora Visual de KUMAR Store

Se requiere actualizar los estilos visuales de la aplicación móvil (React Native + Expo) para alinearse correctamente con el sistema de diseño "The Celestial Curator" definido en el proyecto Stitch AI ("KUMAR Store E-commerce").

## User Review Required

> [!IMPORTANT]
> Para lograr los efectos de degradado solicitados por el design system de Stitch AI en componentes nativos de React Native (como los botones primarios), sugerimos instalar `expo-linear-gradient`. ¿Apruebas instalar esta dependencia para aplicar los *Signature Gradients* en los botones? 
> Además, los efectos de desenfoque (*Glassmorphism*) pueden requerir `expo-blur`. ¿Procedemos con ambas instalaciones?

## Proposed Changes

La reestructuración visual afectará al archivo de configuración de Tailwind y a las pantallas base para aplicar la filosofía de capas tonales (Tonal Layering), eliminar los bordes sólidos (No-Line Rule) y aplicar las tipografías correctas con soporte para jerarquía.

### Configuración Global y Tema

#### [MODIFY] `tailwind.config.js`
Actualizaremos los tokens de colores para incluir los niveles de `surface` y otros colores que definen la profundidad de la interfaz, según los datos extraídos de Stitch:

- **surface:** `#071327` (Fondo general Nivel 0)
- **surface-container-low:** `#101b30` (Bloques de diseño grandes Nivel 1)
- **surface-container:** `#142034` (Tarjetas de producto Nivel 2)
- **surface-container-highest:** `#2a354a` (Modales / Flotantes Nivel 3)
- **primary:** `#90d4ef`
- **primary-container:** `#74b8d3`
- **on-surface:** `#d7e2ff` (Texto primario / Off-White)
- **on-surface-variant:** `#bfc8cd` (Texto secundario / Blue-Grey)

También definiremos las clases utilitarias de fuentes (`font-display`, `font-headline`, `font-body`).

### Pantallas Principales y Componentes

#### [MODIFY] `apps/mobile/app/index.tsx` (Splash/Welcome)
- Remover los bordes genéricos y adaptar la disposición al diseño sugerido (elementos asimétricos, espaciado editorial).
- Actualizar el botón CTA primario para que use un contenedor redondeado amplio (`rounded-2xl` o `rounded-3xl` correspondiente al `xl` radius) y el color `primary-container`.
- Actualizar el botón secundario para remover el borde sólido y usar `primary/40` o el "Ghost Border" como sugiere The Celestial Curator.

#### [MODIFY] `apps/mobile/app/(auth)/login.tsx` (y register.tsx de forma similar)
- Modificar estilos de los `TextInput`. Ahora deben usar el fondo `surface-container-low` sin bordes y con radio `lg` redondeado.
- Re-jerarquizar la tipografía aplicando los tokens Manrope apropiados (Headline para títulos, Body para subtítulos).
- Actualizar el estilo del botón principal al del Design System.

#### [MODIFY] `apps/mobile/app/(tabs)/index.tsx` (Home Catalog)
- **Layering Principle**: El fondo de la App será `surface`. Las secciones como "Categorías", "Destacados" interactuarán visualmente mediante la separación (vertical whitespace).
- **Product Card**:
  - Cambiar el fondo de la tarjeta a `surface-container`.
  - Establecer el borderRadius de la imagen en `12px` (`rounded-xl` / `md` en diseño estricto).
  - Aplicar el "No-Line rule": eliminar cualquier divisor o sombra áspera, usando los espacios entre items.
  - El botón de wishlist flotante deberá usar `surface-container-highest` u opacidad translúcida simulando *Tinted Shadow*.
- **Category Pills**: Refinar los colores de estado base usando los nuevos contenedores `surface-container`.

#### [MODIFY] `apps/mobile/app/(tabs)/_layout.tsx`
- Si es posible sin librerías externas de momento, estilizar el `tabBar` para simular el efecto Glassmorphism agregando algo de opacidad y `surface-container-lowest`/`surface-container`.

## Open Questions

> [!WARNING]  
> ¿Está de acuerdo con agregar `expo-linear-gradient` y `expo-blur` a las dependencias de `/apps/mobile` para cumplir 100% las especificaciones de reflejo y gradientes estipuladas en el informe de Stitch?  De lo contrario, usaremos colores planos `primary-container` que simulan la cercanía visual.

## Verification Plan

### Manual Verification
1. Ejecutar el proyecto en Expo.
2. Comprobar visualmente la paleta de colores oscuros, ausencia de bordes sólidos de 1px (salvo bordes fantasma).
3. Verificar que la pantalla inicial (Splash) se ve de alta calidad (premium) usando los nuevos radios de bordes y colores.
4. Navegar entre el Home y el Login comprobando la estructura de inputs y tipografía.
