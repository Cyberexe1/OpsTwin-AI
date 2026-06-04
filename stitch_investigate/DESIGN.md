---
name: OpsTwin AI Narrative
colors:
  surface: '#17130f'
  surface-dim: '#17130f'
  surface-bright: '#3d3833'
  surface-container-lowest: '#110e0a'
  surface-container-low: '#1f1b17'
  surface-container: '#231f1b'
  surface-container-high: '#2e2925'
  surface-container-highest: '#39342f'
  on-surface: '#eae1da'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#eae1da'
  inverse-on-surface: '#34302b'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#5de6ff'
  on-secondary: '#00363e'
  secondary-container: '#00cbe6'
  on-secondary-container: '#00515d'
  tertiary: '#54d8e8'
  on-tertiary: '#00363c'
  tertiary-container: '#21b7c7'
  on-tertiary-container: '#00434a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#a2eeff'
  secondary-fixed-dim: '#2fd9f4'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5a'
  tertiary-fixed: '#91f1ff'
  tertiary-fixed-dim: '#54d8e8'
  on-tertiary-fixed: '#001f23'
  on-tertiary-fixed-variant: '#004f57'
  background: '#17130f'
  on-background: '#eae1da'
  surface-variant: '#39342f'
typography:
  hero-heading:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  hero-heading-mobile:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.15em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

The design system is engineered for **OpsTwin AI**, a platform focused on agentic workflows and high-performance operations. The brand personality is professional, authoritative, and futuristic, evoking the precision of a high-tech control center. It balances the "warmth" of industrial hardware with the "electricity" of artificial intelligence.

The visual style is a fusion of **Minimalism** and **Modern Technical Design**. It utilizes deep, warm charcoal tones to ground the interface, contrasted by vibrant cyan accents that represent the "pulse" of the AI. The aesthetic is clean and structured, favoring data density and legibility over decorative elements. Visual interest is generated through subtle glow effects (photonic styling) and sharp, monospaced typography that signals developer-readiness and technical transparency.

## Colors

The palette is strictly divided into **Warm Neutrals** and **Electric Accents**. To maintain a sophisticated technical feel, all grays must avoid blue or cool undertones, relying instead on brown/charcoal temperatures.

- **Foundations:** Use `#1a1612` for the main canvas. Layer surfaces using `#211e19` and `#3a3530` to create a logical hierarchy of information containers.
- **Accents:** Use Cyan-500 (`#06B6D4`) for primary actions and interactive states.
- **Electric Highlights:** Reserved for high-priority status indicators, terminal prompts, and active AI "thinking" states.
- **Glows:** Apply Cyan-400 (`#22D3EE`) with low opacity (10-20%) for "agentic pulse" effects around active modules.

## Typography

This design system uses a dual-font strategy to differentiate between the human interface and the machine backend.

- **Inter (Sans-Serif):** Used for all primary communication, headings, and body copy. It provides a clean, neutral, and highly readable foundation. Hero headings utilize tight tracking and bold weights for maximum impact.
- **JetBrains Mono (Monospaced):** Used for section labels, terminal windows, code snippets, and data points. This font reinforces the "Ops" (Operations) aspect of the product, signaling precision and technical accuracy.
- **Section Labels:** Must always be rendered in `label-caps` using the accent color (`#22D3EE`) to act as clear navigational anchors.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to ensure data density remains controlled and professional. 

- **Grid:** A 12-column grid with a 24px gutter. Elements should snap to the grid to maintain structural integrity.
- **Rhythm:** An 8px linear scale is used for most spacing (8, 16, 24, 32, 48, 64). 
- **Density:** High data density is encouraged for dashboard views. Use `stack-sm` for related input fields and `stack-lg` for separating distinct logical modules.
- **Mobile:** On mobile, the grid collapses to a single column with 16px side margins. Large headings should scale down to `hero-heading-mobile` to maintain visual balance.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Subtle Luminous Effects** rather than traditional shadows.

- **Layering:** The background (`#1a1612`) is the lowest level. Content cards and sidebars sit on the surface (`#211e19`). Modals and popovers use the elevated surface (`#3a3530`).
- **Outlines:** All containers must use a 1px border (`#2e2a24`). For active or focused states, the border color transitions to the primary accent (`#06B6D4`).
- **Photonic Glow:** Interactive elements (like buttons or active AI nodes) utilize an "Accent Glow." This is a soft `box-shadow` using the primary accent color with a high blur (20-30px) and very low opacity (0.15), creating a sense that the UI is powered from within.

## Shapes

The shape language is **Soft** but disciplined. 

- **Base Radius:** 0.25rem (4px) for most UI elements like inputs and buttons. This creates a sharp, professional look that isn't as aggressive as 0px corners.
- **Large Radius:** 0.75rem (12px) for major containers and cards to give them a modern, contained feel.
- **Consistency:** Avoid pill-shaped buttons; stick to the rectangular base with slight rounding to maintain the "technical tool" aesthetic.

## Components

### Buttons
- **Primary:** Background `#06B6D4`, text `#1a1612` (high contrast). On hover, transition to `#0891B2` with a subtle cyan outer glow.
- **Secondary:** Transparent background, 1px border `#2e2a24`, text `#F9FAFB`. Hover state changes border to `#9CA3AF`.

### Input Fields
- Dark background (`#1a1612`), 1px border (`#2e2a24`). On focus, border becomes `#06B6D4` with a 2px inner glow. Use JetBrains Mono for input text to signify data entry.

### Terminal & Code Blocks
- Background `#1a1612`. Headers for these blocks should use `#211e19` with the `label-caps` typography style. Use Cyan-300 for prompts (`>`) and Cyan-500 for active cursors.

### Chips & Status Indicators
- Status chips use a background of 10% opacity of the status color (e.g., Cyan for active, Amber for warning). They should feature a 4px "pulse" dot to the left of the label.

### Cards
- Standard containers use `#211e19` with a `#2e2a24` border. No shadow. Hierarchy is defined purely by the border and the internal spacing.