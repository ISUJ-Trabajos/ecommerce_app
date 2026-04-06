# DESIGN SYSTEM SPECIFICATION

## 1. Overview & Creative North Star: "The Celestial Curator"

The design system is defined by a **Creative North Star** we call **"The Celestial Curator."** Inspired by the deep Andean night sky and the sleek, metallic curves of the brand identity, this system avoids the "flat-box" pitfalls of standard e-commerce. Instead, it treats the mobile screen as a premium editorial canvas.

We break the "template" look through **Intentional Asymmetry** and **Tonal Depth**. Rather than placing items in rigid, boxed grids, we use overlapping elements, varying vertical rhythms, and high-contrast typography scales. The goal is a digital experience that feels less like a database and more like a curated high-end boutique in the heart of Quito.

---

## 2. Colors

This palette is rooted in a deep, nocturnal foundation. It relies on the interplay of navy and celeste to create a sense of infinite space and youthful sophistication.

### Core Palette
*   **Main Background:** `#071327` (Deep Navy)
*   **Surface/Cards:** `#132149` (Medium Navy)
*   **Primary Accent:** `#74b8d3` (Celeste)
*   **Primary Text:** `#ededea` (Off-White)
*   **Secondary Text:** `#7d8489` (Blue-Grey)

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders for sectioning content. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background provides all the separation needed. Vertical whitespace and tonal transitions are your primary tools for layout.

### Surface Hierarchy & Nesting
Treat the UI as physical layers—stacked sheets of tinted glass.
*   **Level 0 (Base):** `surface` (`#071327`) - The foundation.
*   **Level 1 (Sections):** `surface-container-low` (`#101b30`) - Large layout blocks.
*   **Level 2 (Cards):** `surface-container` (`#142034`) - Interactive product cards.
*   **Level 3 (Modals/Popups):** `surface-container-highest` (`#2a354a`) - Elevated floating elements.

### The "Glass & Gradient" Rule
To echo the metallic sheen of the logo, use **Glassmorphism** for navigation bars and floating action buttons. Use semi-transparent surface colors with a `20px` backdrop-blur. 
*   **Signature Texture:** Apply a subtle linear gradient (from `primary` to `primary_container`) to main CTAs. This provides a "soulful" luminosity that flat hex codes cannot achieve.

---

## 3. Typography: Manrope Editorial

We utilize **Manrope**, a modern geometric sans-serif that balances technical precision with a warm, youthful human touch.

*   **Display (lg/md):** Use for hero headers. Kerning should be set to `-2%` to feel tight and custom.
*   **Headline (lg/md/sm):** High-contrast sizing creates an editorial feel. Headlines should feel "authoritative."
*   **Body (lg/md):** Optimized for readability in dark mode. Line height is set to `1.6` to allow the light text to breathe against the dark background.
*   **Label (md/sm):** Reserved for metadata and micro-copy. Use `secondary_text` (`#7d8489`) to maintain hierarchy.

---

## 4. Elevation & Depth

We move away from traditional shadows in favor of **Tonal Layering**. 

*   **The Layering Principle:** Depth is achieved by stacking tiers. A `surface-container-lowest` card placed on a `surface-container-low` background creates a soft, natural lift.
*   **Ambient Shadows:** For floating elements, use a "Tinted Shadow." 
    *   *Shadow Color:* `#000000` at 15% opacity + a subtle `#74b8d3` outer glow (4% opacity).
    *   *Blur:* `32px` to `64px` for a diffused, ambient light effect.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at **15% opacity**. Pure 100% opaque borders are strictly prohibited.

---

## 5. Components

### Buttons
*   **Primary:** Background: `primary_container` (`#74b8d3`), Text: `surface` (`#071327`). **Shape:** `xl` (1.5rem/24px) for a modern, pill-like feel.
*   **Secondary:** Background: Transparent, Border: `primary` (`#74b8d3`) at 40% opacity, Text: `primary`.
*   **Interaction:** On press, the celeste background should scale down slightly (98%) to provide haptic visual feedback.

### Input Fields
*   **Style:** Filled containers (`#132149`) with rounded corners (`lg`). 
*   **State:** Inactive borders use `secondary_text`. Active states use a `primary` (`#74b8d3`) glow. Avoid "box" feelings; let the input feel like a carved-out surface.

### Status Pills
*   **Geometry:** Full rounded (`full`).
*   **Logic:** Backgrounds are low-saturation versions of the status color to keep the app "Sophisticated."
    *   *Delivered:* Soft Emerald / *Pending:* Soft Amber / *Cancelled:* Soft Rose.

### Cards & Lists
*   **Constraint:** Zero dividers. Use vertical white space from the Spacing Scale (16px, 24px, 32px) to separate content. 
*   **Image Treatment:** Product images should have a `md` (12px) corner radius and sit within a `surface-container` to pop against the main background.

### Signature Component: The "Curated Float"
In the product feed, occasionally break the 2-column grid with a single, large image that overlaps a background surface container. This breaks the monotony and reinforces the premium "Editorial" brand positioning.

---

## 6. Do’s and Don'ts

### Do
*   **DO** use varying typography sizes to create a clear "read-first" path.
*   **DO** use the Celeste accent sparingly for "A-ha" moments (CTAs, success states).
*   **DO** lean into the dark mode; use pure black only for the deepest shadows, never for surfaces.

### Don’t
*   **DON'T** use 1px solid white or grey lines. It breaks the "Celestial" immersion.
*   **DON'T** use generic Android "ripple" effects in bright white; keep ripples subtle and tinted with the primary color.
*   **DON'T** clutter the screen. If a section feels crowded, increase the vertical spacing by one step on the scale rather than adding a divider.