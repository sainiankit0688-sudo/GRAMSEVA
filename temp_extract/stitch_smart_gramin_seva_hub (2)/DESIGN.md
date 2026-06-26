---
name: Gram Seva
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#40493d'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#707a6c'
  outline-variant: '#bfcaba'
  surface-tint: '#1b6d24'
  primary: '#0d631b'
  on-primary: '#ffffff'
  primary-container: '#2e7d32'
  on-primary-container: '#cbffc2'
  inverse-primary: '#88d982'
  secondary: '#964900'
  on-secondary: '#ffffff'
  secondary-container: '#fc820c'
  on-secondary-container: '#5e2c00'
  tertiary: '#00569f'
  on-tertiary: '#ffffff'
  tertiary-container: '#006eca'
  on-tertiary-container: '#ebf1ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a3f69c'
  primary-fixed-dim: '#88d982'
  on-primary-fixed: '#002204'
  on-primary-fixed-variant: '#005312'
  secondary-fixed: '#ffdcc6'
  secondary-fixed-dim: '#ffb786'
  on-secondary-fixed: '#311300'
  on-secondary-fixed-variant: '#723600'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a5c8ff'
  on-tertiary-fixed: '#001c3a'
  on-tertiary-fixed-variant: '#004786'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin-mobile: 16px
  container-margin-desktop: 32px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is built on a foundation of **Civic Trust** and **Community Empowerment**. It bridges the gap between traditional rural values and modern digital efficiency. The aesthetic is "Modern-Grounded"—it avoids the clinical coldness of typical SaaS products in favor of a warm, approachable, and highly legible interface.

The visual direction uses a **Corporate-Modern** base infused with **Earthy Minimalism**. It prioritizes high-contrast clarity and generous touch targets to accommodate users with varying levels of digital literacy and different environmental lighting conditions (such as bright outdoor usage). The emotional response should be one of reliability, local pride, and ease of use.

## Colors

The palette is derived from the rural landscape to evoke familiarity and state-backed authority.

*   **Primary (Harvest Green):** Used for primary actions, success states, and branding. It represents growth and stability.
*   **Secondary (Saffron Warmth):** Used for alerts, highlights, and secondary call-to-actions. It provides high visibility against the green.
*   **Tertiary (Utility Blue):** Reserved for information links and specialized service categories.
*   **Backgrounds:** A crisp white (#FFFFFF) is used for main surfaces, while a very light grey (#F5F5F5) defines the background to reduce screen glare and separate content cards.
*   **Typography & Icons:** Dark Charcoal (#212121) is used instead of pure black to ensure high contrast that is still comfortable for prolonged reading.

## Typography

This design system utilizes two distinct sans-serif families to maximize accessibility:

1.  **Plus Jakarta Sans:** Used for headings. Its soft, rounded terminals feel welcoming and modern, reducing the "intimidation factor" of a government or service application.
2.  **Atkinson Hyperlegible Next:** Used for all body text and UI labels. Specifically designed for low-vision users, it ensures that similar characters are easily distinguishable, which is critical for users with varying levels of literacy or visual impairment.

**Hierarchy Rules:**
- Keep line lengths between 45-75 characters for readability.
- Use `body-lg` for any instructional text to ensure ease of reading.
- Headings should use "Sentence case" to feel more conversational and less formal.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a focus on vertical rhythm. 

- **Mobile First:** Since most users will access the service via mobile devices, all layouts must stack vertically by default.
- **Touch Targets:** Minimum touch target size is 48x48px for all interactive elements.
- **Margins:** 16px horizontal margins on mobile, expanding to 32px or centered 1200px max-width on desktop.
- **Rhythm:** Use an 8px base grid. All padding and margins should be multiples of 8 (8, 16, 24, 32, 48).

## Elevation & Depth

This design system uses **Tonal Layers** rather than heavy shadows to create depth. This ensures the UI feels light and runs smoothly on lower-end mobile hardware.

- **Level 0 (Base):** Light grey background (#F5F5F5).
- **Level 1 (Cards/Surface):** Pure white background (#FFFFFF) with a very thin 1px stroke (#E0E0E0).
- **Level 2 (Interaction):** When an element is active or needs to pop, use a soft, diffused shadow: `0px 4px 12px rgba(0, 0, 0, 0.05)`.
- **Level 3 (Modals):** A darker scrim (60% opacity) with a centered white container.

## Shapes

The shape language is **Rounded**, avoiding sharp corners to maintain a friendly, community-oriented feel.

- **Default (Buttons/Inputs):** 8px (0.5rem) corner radius.
- **Large (Cards/Containers):** 16px (1rem) corner radius.
- **Extra Large (Hero Sections/Bottom Sheets):** 24px (1.5rem) top-corner radius.
- **Full (Chips/Badges):** Pill-shaped for high distinction from buttons.

## Components

### Buttons
- **Primary:** Solid Primary Green background with white text. High-contrast, bold weight.
- **Secondary:** Outlined with Primary Green or Solid Saffron for urgent alerts.
- **Tertiary:** Text-only for less important actions like "Cancel" or "Back".

### Input Fields
- Inputs must have a persistent label above the field (no floating labels) to ensure context is never lost.
- Borders are 1px solid grey, changing to 2px Primary Green on focus.
- Error states must include both a red border and an error icon for accessibility.

### Cards
- Cards are the primary container for village services (e.g., "Apply for Ration Card"). 
- They should include a simple, thick-stroke icon on the left or top to aid recognition for non-readers.

### Lists
- Use generous vertical padding (16px) between list items.
- Every list item should have a chevron `>` icon to indicate it is clickable.

### Selection (Radio/Checkbox)
- Use larger-than-standard hit areas.
- Primary Green is the active color for all selection components.

### Service Badges (Chips)
- Used for status indicators (e.g., "Pending", "Approved", "Action Required"). 
- Status-specific colors: Green for Approved, Saffron for Pending, Red for Action Required.