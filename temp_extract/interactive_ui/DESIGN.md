---
name: Response System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#5c403c'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#916f6b'
  outline-variant: '#e6bdb8'
  surface-tint: '#bf0715'
  primary: '#b70011'
  on-primary: '#ffffff'
  primary-container: '#dc2626'
  on-primary-container: '#fff6f5'
  inverse-primary: '#ffb4ab'
  secondary: '#1d4ed8'
  on-secondary: '#ffffff'
  secondary-container: '#4069f2'
  on-secondary-container: '#fffbff'
  tertiary: '#a82155'
  on-tertiary: '#ffffff'
  tertiary-container: '#c93c6d'
  on-tertiary-container: '#fff6f6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000b'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001551'
  on-secondary-fixed-variant: '#0039b5'
  tertiary-fixed: '#ffd9e0'
  tertiary-fixed-dim: '#ffb1c3'
  on-tertiary-fixed: '#3f0019'
  on-tertiary-fixed-variant: '#8e0542'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Archivo Narrow
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  callout:
    fontFamily: Archivo Narrow
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  safe-margin: 20px
  gutter: 16px
  touch-target-min: 48px
  component-gap: 12px
  section-padding: 32px
---

## Brand & Style

This design system is engineered for critical, high-stakes environments where cognitive load must be minimized and action speed maximized. The brand personality is **authoritative, urgent, and ultra-reliable**. It utilizes a **Modern High-Contrast** style, stripping away decorative elements in favor of functional clarity and unmistakable affordances.

The UI targets individuals in distress or emergency personnel, requiring an interface that remains legible under physical duress or poor lighting. The visual mood is serious and professional, utilizing intense semantic signaling to guide users toward the correct service without hesitation.

## Colors

The palette is strictly functional, leveraging color as the primary information carrier. 

- **Primary (Urgent Red):** Reserved exclusively for medical emergencies and immediate life-safety actions. It demands instant attention.
- **Secondary (Police Blue):** Used for law enforcement and security services, evoking authority and systematic response.
- **Tertiary (Supportive Magenta):** A high-visibility, distinct hue for specialized helplines, ensuring it is never confused with general medical or police services.
- **Neutral (Slate):** Deep charcoal and slate tones provide a stable foundation, ensuring that color-coded actions pop against a grounded background.

The default mode is high-contrast light to ensure maximum screen brightness and visibility in outdoor or bright daylight conditions.

## Typography

Legibility is the absolute priority. We utilize **Archivo Narrow** for headlines to allow for high-impact, large-scale text that fits efficiently within mobile widths. For body and labels, we use **Atkinson Hyperlegible Next**, specifically designed to increase character recognition and reduce misreading in high-stress situations.

Hierarchy is enforced through extreme weight contrast. Actionable labels use uppercase tracking to differentiate them from static information.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for thumb-reachability. We employ a strict 8px rhythm to maintain clean alignment. 

- **Margins:** 20px side margins ensure content does not bleed into bezel curves.
- **Touch Targets:** A minimum 48px height is enforced for all interactive elements, though primary emergency triggers should exceed 80px for reliable "blind" activation.
- **Vertical Stack:** Elements are stacked vertically to prioritize a single-column flow, preventing cognitive overwhelm during decision-making.

## Elevation & Depth

This system avoids complex shadows or decorative depth. Instead, it uses **Tonal Layers** and **Strong Outlines** to define hierarchy.

- **Primary Actions:** Use high-saturation solid fills with no transparency.
- **Secondary Actions:** Use thick 2px borders (High-Contrast Outlines) in the respective semantic color.
- **Depth:** Surfaces use a "stacked paper" metaphor where the most critical information is on the brightest white surface, while background utility functions sit on a light slate (`#F1F5F9`) base.
- **Feedback:** On-press states should involve a clear tonal shift (e.g., 10% darkening of the fill) rather than a shadow change, providing immediate tactile confirmation.

## Shapes

We use **Rounded** (0.5rem) corners for standard components to maintain a modern, professional feel that balances urgency with approachability. 

- **Primary Emergency Cards:** Use `rounded-xl` (1.5rem) to make them feel distinct and substantial—almost like physical buttons.
- **Inputs and Small Buttons:** Use standard `rounded-md` (0.5rem) to maintain a crisp, organized appearance.

## Components

### Buttons & Action Cards
- **Emergency Action Cards:** Massive, full-width containers with a semantic color background (Red, Blue, or Magenta). They include a large icon (Left), a bold headline, and a secondary "tap to call" sub-label.
- **System Buttons:** High-contrast solid fills for primary actions; 2px bordered "Ghost" buttons for secondary actions.

### Inputs & Fields
- **Search/Location Inputs:** Heavy 2px borders in Neutral-800. Focused states use a 3px highlight in Police Blue. Text within inputs is always `body-lg` for clarity.

### Chips & Badges
- **Status Indicators:** Small, pill-shaped badges used to indicate service availability (e.g., "Active," "Dispatched"). Use high-contrast white text on dark neutral backgrounds.

### Lists & Information
- **Instructions:** Bulleted lists with increased line height (`body-lg`) to ensure readability while moving. Each item is separated by a subtle 1px divider.

### Checkboxes & Radio Buttons
- **Selection:** Oversized touch targets (44x44px min). When selected, the entire container should shift to a light tint of the primary color to ensure the user knows their selection is registered.