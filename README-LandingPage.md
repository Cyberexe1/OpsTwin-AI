# OpsTwin AI — Landing Page Implementation Guide

## Overview

This document maps directly to the stitch design in `/stitch_landing_page/`. The landing page is a single-scroll marketing site built with the design system defined in `DESIGN.md`.

**Source of Truth:** `stitch_landing_page/code.html` + `stitch_landing_page/DESIGN.md`

---

## Design System Summary

### Color Palette (Warm Charcoal + Electric Cyan)

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#17130f` | Page canvas, deepest layer |
| `surface` | `#17130f` | Same as background |
| `surface-container` | `#231f1b` | Section alternate background, cards |
| `surface-container-low` | `#1f1b17` | Subtle container layer |
| `surface-variant` | `#39342f` | Terminal header, elevated elements |
| `outline-variant` | `#3d494c` | Borders (1px) on all containers |
| `on-surface` | `#eae1da` | Primary text (warm white) |
| `on-surface-variant` | `#bcc9cd` | Secondary text (muted) |
| `primary` | `#4cd7f6` | Accent highlights, active states |
| `primary-container` | `#06b6d4` | Buttons, strong accent (cyan-500) |
| `on-primary-container` | `#00424f` | Text on primary buttons |
| `secondary` | `#5de6ff` | Secondary accent |
| `error` | `#ffb4ab` | Error states |

### Typography

| Token | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| `hero-heading` | Inter | 72px | 700 | Hero H1 (desktop) |
| `hero-heading-mobile` | Inter | 48px | 700 | Hero H1 (mobile) |
| `headline-lg` | Inter | 40px | 600 | Section headings |
| `headline-md` | Inter | 24px | 600 | Sub-headings |
| `body-lg` | Inter | 18px | 400 | Lead paragraphs |
| `body-md` | Inter | 16px | 400 | Default body text |
| `label-caps` | JetBrains Mono | 14px | 500 | Section labels, uppercase, 0.15em tracking |
| `code-sm` | JetBrains Mono | 13px | 400 | Terminal content |

### Effects

| Effect | Implementation |
|--------|---------------|
| Cyan Glow | `box-shadow: 0 0 25px -5px rgba(6, 182, 212, 0.2)` |
| Dot Grid | `radial-gradient(#3d494c 1px, transparent 1px)` at 32px spacing, 20% opacity |
| Hero Radial | `radial-gradient(circle at center, #211e19 0%, #17130f 100%)` |
| Dashed Connector | `linear-gradient(to bottom, #2e2a24 50%, transparent 50%)` repeating-y |

---

## Section-by-Section Breakdown

---

### Section 1: Navigation Bar (Fixed)

**Position:** Fixed top, z-50, `bg-background/80 backdrop-blur-md`, border-bottom `outline-variant`

**Layout:**
```
[🧠 OpsTwin AI]                    [Problem] [Solution] [How It Works] [Architecture] [Demo]    [Launch Dashboard]
```

**Elements:**

| Element | Specification |
|---------|--------------|
| Logo Icon | Material Symbol `psychology`, 32px, `text-primary` |
| Brand Text | "OpsTwin AI", `headline-md` size, bold, `text-on-surface` |
| Nav Links | `text-on-surface-variant`, `body-md`, hover → `text-primary`, smooth scroll anchors |
| CTA Button | `bg-primary-container`, `text-on-primary-container`, px-6 py-2, bold, `cyan-glow`, hover → scale-105 |
| Mobile | Nav links hidden below `md:`, hamburger menu (not in stitch yet — implement as slide drawer) |
| Container | `max-w-container-max` (1280px), `mx-auto`, `px-gutter` (24px) |

---

### Section 2: Hero Section

**Background:** `hero-radial` gradient + `dot-grid` overlay at 20% opacity  
**Padding:** `pt-40 pb-20` (accounts for fixed nav)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   [🏆 Splunk Agentic Ops Hackathon 2025]  ← badge     │
│                                                         │
│   Your Best Engineers Leave.                            │
│   Their Expertise Shouldn't.  ← cyan-colored           │
│                                                         │
│   OpsTwin AI creates Digital Operational Twins...       │
│                                                         │
│   [Start Investigation]   [Watch Demo]                  │
│                                                         │
│   ┌─────────────────────────────────────────┐          │
│   │  Terminal with typewriter animation      │          │
│   │  (agent investigation simulation)        │          │
│   └─────────────────────────────────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elements:**

| Element | Specification |
|---------|--------------|
| Badge | Pill: `rounded-full`, border `primary/30`, bg `primary/5`, icon 🏆 + text in `label-caps` `text-primary` |
| Headline | `hero-heading` (72px/700), `text-on-surface`, max-w-4xl, mx-auto |
| Headline Accent | Second line "Their Expertise Shouldn't." in `text-primary-container` (#06b6d4) |
| Subheadline | `body-lg` (18px), `text-on-surface-variant`, max-w-2xl, mx-auto |
| Primary CTA | `bg-primary-container`, `text-on-primary-container`, px-8 py-4, bold, text-lg, `cyan-glow`, hover → scale-105 |
| Secondary CTA | border `outline-variant`, `text-on-surface`, px-8 py-4, bold, hover → `bg-surface-container` |
| Buttons | Stack vertically on mobile (`flex-col`), horizontal on `md:` |

**Terminal Component:**

| Part | Specification |
|------|--------------|
| Container | `max-w-4xl mx-auto`, `bg-surface-container`, border `outline-variant`, `rounded-lg`, shadow-2xl |
| Header Bar | `bg-surface-variant`, px-4 py-2, border-bottom `outline-variant` |
| Traffic Lights | 3 circles (w-3 h-3 rounded-full): red-500/50, amber-500/50, primary/50 |
| Header Label | `label-caps` 12px, `text-on-surface-variant`, right-aligned: "opstwin-agent-v1.0.4 --bash" |
| Terminal Body | `bg-background`, p-6, min-h-[320px], `code-sm` font |
| Typewriter | Lines appear one by one with character-by-character animation (40ms/char, 400ms between lines) |

**Terminal Lines Data:**

```
Line 1: "$ opstwin investigate alert_id=392-B"          → text-on-surface
Line 2: "⠋ Analyzing Splunk logs for service 'checkout-api'..."  → text-amber-400
Line 3: "✔ Anomalous spike detected in DB connection pool (98.2%)"  → text-primary
Line 4: "⠋ Consulting Historical Expert: Senior_Dave.twin..."  → text-amber-400
Line 5: "✔ Dave's previous resolution (Oct 22): Recalibrate pool size"  → text-primary
Line 6: "Proposed Plan:"  → text-primary-container, font-bold
Line 7: "1. Increase max_connections to 250 via MCP control"  → text-primary
Line 8: "2. Trigger Splunk re-indexing for affected pods"  → text-primary
Line 9: "3. Verify MTTR metrics"  → text-primary
Line 10: "$ Ready for approval? (y/n)_"  → text-on-surface
```

---

### Section 3: Problem Section

**Background:** `bg-surface-container`  
**Padding:** `py-section-gap` (80px)  
**ID:** `#problem`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ▎ When Expert Engineers Leave...  ← border-l-4 cyan  │
│                                                         │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│   │     47%      │ │    3.5h      │ │     92%      │  │
│   │ KNOWLEDGE    │ │ ONBOARDING   │ │ RECURRENCE   │  │
│   │ DRAIN        │ │ LAG          │ │ RATE         │  │
│   │              │ │              │ │              │  │
│   │ description  │ │ description  │ │ description  │  │
│   └──────────────┘ └──────────────┘ └──────────────┘  │
│                                                         │
│   ▎ "The biggest bottleneck in modern observability..." │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elements:**

| Element | Specification |
|---------|--------------|
| Heading | `headline-lg` (40px/600), `text-on-surface`, `border-l-4 border-primary pl-6` |
| Stats Grid | 3 columns on `md:`, 1 column mobile, gap `gutter` (24px) |
| Stat Cards | `bg-background`, p-8, border `outline-variant`, hover → border changes to error/amber color |
| Stat Number | `text-4xl font-bold`, colors: red-400, amber-400, red-400 |
| Stat Label | `label-caps` (JetBrains Mono, 14px, uppercase), `text-on-surface-variant` |
| Stat Description | `text-on-surface-variant`, `body-md` |
| Quote Block | `border-l-4 border-primary`, `bg-background`, p-8 |
| Quote Text | `body-lg`, italic, `text-on-surface` |
| Quote Attribution | `text-primary`, `label-caps`, text-sm |

**Stats Data:**

| Value | Label | Description | Number Color |
|-------|-------|-------------|-------------|
| 47% | KNOWLEDGE DRAIN | Of critical system knowledge is lost when a Senior Staff Engineer transitions or leaves | red-400 |
| 3.5h | ONBOARDING LAG | Average time spent by juniors searching through old Slack threads and JIRA tickets per incident | amber-400 |
| 92% | RECURRENCE RATE | Of complex outages are caused by issues seen before, but resolved by someone no longer on-call | red-400 |

---

### Section 4: Solution Section

**Background:** `bg-background`  
**Padding:** `py-section-gap` (80px)  
**ID:** `#solution`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│          The OpsTwin Evolution (centered)                │
│   We don't just alert you. We capture the intent...     │
│                                                         │
│   ┌─────────────────────┐  ┌─────────────────────┐    │
│   │  ⚠️ The Siloed Present │  │  ✨ The Agentic Future │    │
│   │  TRADITIONAL OBS     │  │  OPSTWIN AI          │    │
│   │                      │  │                      │    │
│   │  ✕ Manual interpret  │  │  ✓ Digital Twins     │    │
│   │  ✕ Context dies      │  │  ✓ MCP actionability │    │
│   │  ✕ On-call fatigue   │  │  ✓ Codified knowledge│    │
│   │                      │  │                      │    │
│   │  [opacity-80]        │  │  [cyan-glow border]  │    │
│   └─────────────────────┘  └─────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elements:**

| Element | Specification |
|---------|--------------|
| Section Title | `headline-lg`, `text-on-surface`, text-center |
| Subtitle | `text-on-surface-variant`, max-w-2xl, mx-auto, `<strong>` for emphasis |
| Grid | 2 columns on `lg:`, 1 column mobile, gap-12, items-stretch |
| Before Card | `bg-surface-container`, border `outline-variant`, p-8, `opacity-80` |
| Before Tag | "TRADITIONAL OBS" in red-500, `label-caps`, text-xs, absolute top-right |
| Before Icon | Material Symbol `warning`, text-red-400 |
| Before Items | ✕ prefix in `text-red-400`, description in `text-on-surface-variant` |
| After Card | `bg-surface-container`, border `border-primary`, p-8, `cyan-glow` |
| After Glow | Absolute `w-32 h-32 bg-primary/5 blur-3xl` in top-right corner |
| After Tag | "OPSTWIN AI" in `text-primary`, `label-caps`, text-xs, absolute top-right |
| After Icon | Material Symbol `auto_awesome`, text-primary |
| After Items | ✓ prefix in `text-primary`, description in `text-on-surface` (brighter than Before) |

**Before Items:**
1. Dashboards require manual expert interpretation
2. Incident context dies in closed DM threads
3. On-call fatigue leads to high turnover

**After Items:**
1. Digital Twins shadow and learn from expert behavior
2. Splunk MCP provides direct agent-to-tool actionability
3. Knowledge is codified, not just documented

---

### Section 5: How It Works

**Background:** `bg-surface-container`  
**Padding:** `py-section-gap` (80px)  
**ID:** `#how-it-works`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│       How OpsTwin Codifies Expertise (centered)         │
│                                                         │
│   ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐         │
│   │  ⚠️   │  │  🧠   │  │  📋   │  │  ✓    │         │
│   │       │  │       │  │       │  │       │         │
│   │Alert  │  │Expert │  │Plan   │  │Auto-  │         │
│   │Ingest │  │Shadow │  │Gener. │  │Remed. │         │
│   │       │  │       │  │       │  │       │         │
│   │ desc  │  │ desc  │  │ desc  │  │ desc  │         │
│   └───────┘  └───────┘  └───────┘  └───────┘         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elements:**

| Element | Specification |
|---------|--------------|
| Section Title | `headline-lg`, `text-on-surface`, text-center, mb-20 |
| Grid | 4 columns on `md:`, 1 column mobile, gap `gutter` |
| Step Circle | w-16 h-16, rounded-full, `bg-background`, border `outline-variant`, flex center, group-hover → border-primary |
| Step Icon | Material Symbol, text-3xl, specific color per step |
| Step Title | `headline-md` at 20px, `text-on-surface` |
| Step Description | `text-on-surface-variant`, body-md |

**Steps:**

| # | Icon | Icon Color | Title | Description |
|---|------|-----------|-------|-------------|
| 1 | `report_problem` | amber-400 | Alert Ingestion | OpsTwin monitors Splunk signals and identifies high-priority anomalies before they escalate. |
| 2 | `psychology` | primary (#4cd7f6) | Expert Shadowing | The agent observes how your senior engineers query Splunk and interact with the MCP. |
| 3 | `assignment` | primary-container (#06b6d4) | Plan Generation | A resolution plan is created based on historical successes and learned reasoning paths. |
| 4 | `check_circle` | green-400 | Auto-Remediation | OpsTwin executes the fix or provides a 'one-click' approval for human operators. |

---

### Section 6: Architecture

**Background:** `bg-background`  
**Padding:** `py-section-gap` (80px)  
**ID:** `#architecture`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│       The Agentic Architecture (centered)               │
│                                                         │
│         ┌───────────────────────┐                      │
│         │   Splunk MCP Server    │  ← cyan border+glow │
│         └───────────┬───────────┘                      │
│                     │ (dashed)                          │
│       ┌─────────────┼─────────────┐                   │
│       ▼             ▼             ▼                   │
│   ┌────────┐  ┌──────────┐  ┌────────┐              │
│   │Historian│  │Expert    │  │Risk    │              │
│   │Agent   │  │Twin Agent│  │Assess. │              │
│   └────┬───┘  └────┬─────┘  └───┬────┘              │
│        │            │            │  (dashed)          │
│        ▼            ▼            ▼                    │
│         ┌───────────────────────┐                     │
│         │  Resolution Planner    │                     │
│         └───────────────────────┘                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elements:**

| Element | Specification |
|---------|--------------|
| Section Title | `headline-lg`, `text-on-surface`, text-center, mb-20 |
| MCP Server Node | `bg-primary/5`, border `border-primary`, px-8 py-4, `rounded-lg`, `cyan-glow`, `label-caps text-primary` |
| Dashed Connector | `w-1 h-12`, `dashed-connector` class (see CSS above) |
| Agent Cards Grid | 3 columns on `md:`, 1 column mobile, gap `gutter`, max-w-5xl |
| Agent Cards | `bg-surface-container`, border `outline-variant`, p-6, `rounded-lg`, text-center, hover → scale-105 |
| Agent Icons | Material Symbol, text-4xl, specific colors |
| Agent Titles | font-bold, `text-on-surface` |
| Agent Descriptions | text-sm, `text-on-surface-variant` |
| Bottom Connectors | 3 vertical dashed lines (flex justify-around) |
| Resolution Planner | `bg-surface-container`, border `outline-variant`, px-12 py-6, `rounded-lg` |
| Planner Title | `headline-md`, `text-on-surface` |
| Planner Desc | `text-on-surface-variant` |

**Agent Cards:**

| Agent | Icon | Icon Color | Description |
|-------|------|-----------|-------------|
| Historian Agent | `history` | primary (#4cd7f6) | Parses historical RFOs and Splunk query logs. |
| Expert Twin Agent | `hub` | purple-400 | Replicates learned logic paths of specific users. |
| Risk Assessment | `gavel` | amber-400 | Validates remediation plans against safety rules. |

---

### Section 7: Splunk Integration

**Background:** `bg-surface-container`  
**Padding:** `py-section-gap` (80px)  
**ID:** `#splunk`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ┌──────────────────────┐  ┌──────────────────────┐  │
│   │                      │  │                      │  │
│   │  Deep Splunk Native  │  │  ┌────┐  ┌────┐    │  │
│   │  Integration         │  │  │MCP │  │DATA│    │  │
│   │                      │  │  │CONN│  │OK  │    │  │
│   │  • Metric stream     │  │  └────┘  └────┘    │  │
│   │  • SPL generation    │  │  ┌────┐  ┌────┐    │  │
│   │  • Real-time MCP     │  │  │AUTO│  │SIG │    │  │
│   │                      │  │  │SCAL│  │99  │    │  │
│   │  [🥇 Innovation]     │  │  └────┘  └────┘    │  │
│   │  [⚡ Performance]    │  │                      │  │
│   └──────────────────────┘  └──────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elements:**

| Element | Specification |
|---------|--------------|
| Grid | 2 columns on `lg:`, gap-12, items-center |
| Left — Title | `headline-lg`, `text-on-surface` |
| Left — Description | `text-on-surface-variant`, mb-8 |
| Left — Feature List | Each item: `w-2 h-2 rounded-full bg-primary` dot + text, gap-4 |
| Left — Prize Badges | `bg-background`, border `outline-variant`, `rounded-lg`, p-4, flex row |
| Right — Grid | 2x2 grid, gap-4 |
| Right — MCP Card | `bg-background`, border `border-primary`, `cyan-glow`, aspect-square, flex column justify-between |
| Right — Other Cards | `bg-background`, border `outline-variant`, aspect-square |
| Right — Labels | `label-caps`, text-xs, specific colors |
| Right — Icons | Material Symbol, text-5xl |

**Feature List:**
1. Direct Splunk Observability Cloud metric stream access
2. Automated SPL generation based on natural language intent
3. Real-time dashboard updates via the MCP interface

**Grid Cards:**

| Position | Label | Icon | Border |
|----------|-------|------|--------|
| Top-left | MCP_LAYER_CONNECTED | `settings_input_component` (primary) | border-primary + cyan-glow |
| Top-right | DATA_INGEST_OK | `cloud_download` (on-surface-variant) | border-outline-variant |
| Bottom-left | AUTOSCALE_DISABLED | `analytics` (on-surface-variant) | border-outline-variant |
| Bottom-right | SIGNAL_STRENGTH_99 | `network_check` (on-surface-variant) | border-outline-variant |

---

### Section 8: Impact Metrics

**Background:** `bg-background`  
**Padding:** `py-section-gap` (80px)  
**ID:** `#impact`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│    47         92         500+        3x                 │
│  % MTTR    % ACCURACY   SPLUNK     TEAM                │
│  REDUCTION  RATE        NODES      VELOCITY            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elements:**

| Element | Specification |
|---------|--------------|
| Grid | 4 columns on `md:`, 2 columns mobile, gap `gutter`, text-center |
| Numbers | text-5xl, font-bold, specific colors |
| Labels | `label-caps`, `text-on-surface-variant`, text-sm |
| Animation | Count-up on scroll intersection (IntersectionObserver, 30ms intervals) |

**Metrics:**

| Value | Color | Label |
|-------|-------|-------|
| 47 (count-up) | primary (#4cd7f6) | % MTTR REDUCTION |
| 92 (count-up) | secondary (#5de6ff) | % ACCURACY RATE |
| 500+ (static) | purple-400 | SPLUNK NODES |
| 3x (static) | amber-400 | TEAM VELOCITY |

---

### Section 9: Tech Stack Strip

**Background:** `bg-surface-container`  
**Padding:** `py-12`

**Layout:** Horizontal scrolling strip of technology badges (infinite scroll animation).

**Elements:**

| Element | Specification |
|---------|--------------|
| Container | flex, gap-12, `animate-infinite-scroll`, whitespace-nowrap, px-gutter |
| Highlighted Items | border `border-primary` or `border-primary/20`, `label-caps`, `text-primary-container` or `text-primary` |
| Muted Items | `text-on-surface-variant`, opacity-50, no border |
| Icons | Material Symbols inline with text |

**Items:**

| Label | Icon | Style |
|-------|------|-------|
| SPLUNK MCP | `terminal` | Highlighted (border-primary/20, text-primary-container) |
| PYTHON 3.12 | `code` | Muted (opacity-50) |
| LLM REASONING | `memory` | Highlighted (border-primary, text-primary) |
| VECTOR DB | `database` | Muted |
| KUBERNETES | `lan` | Muted |
| RBAC ENFORCED | `security` | Highlighted (border-primary/20, text-primary-container) |

**Note:** Implement CSS `@keyframes infinite-scroll` for continuous horizontal slide.

---

### Section 10: Footer

**Background:** `bg-surface-container-lowest` (#110e0a)  
**Padding:** `py-section-gap` (80px)  
**Border:** `border-t border-outline-variant`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🧠 OpsTwin AI        Platform          Connect        │
│                                                         │
│  Next-gen agentic     Documentation     GitHub         │
│  operations...        Splunk MCP Guide  Twitter / X    │
│                       Architecture WP   Join Discord   │
│                                                         │
│  ─────────────────────────────────────────────────      │
│  © 2024 OpsTwin AI    Privacy Policy  Terms of Service │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elements:**

| Element | Specification |
|---------|--------------|
| Grid | 3 columns on `md:`, 1 column mobile, gap `gutter`, mb-20 |
| Brand | Logo icon (psychology, primary, 28px) + "OpsTwin AI" (`headline-md`, bold, `text-primary`) |
| Brand Description | `text-on-surface-variant`, max-w-xs |
| Column Headers | font-bold, `text-on-surface`, mb-6 |
| Links | `text-on-surface-variant`, hover → `text-primary`, transition-colors, space-y-3 |
| Divider | `border-t border-outline-variant`, pt `stack-lg` |
| Copyright | text-sm, `text-on-surface-variant` |
| Legal Links | text-sm, `text-on-surface-variant`, hover → `text-secondary` |

---

## JavaScript Behaviors

### 1. Terminal Typewriter

- Triggered when terminal scrolls into viewport (IntersectionObserver, threshold 0.1)
- Character-by-character at 40ms intervals
- 400ms pause between lines
- Cursor blink animation via CSS `::after`

### 2. Count-Up Animation

- Triggered on scroll intersection
- Animates from 0 to target value
- 50 steps, 30ms each (total ~1.5 seconds)
- Only fires once (observer.unobserve after trigger)

### 3. Smooth Scroll

- All `a[href^="#"]` links scroll smoothly to target section
- `scroll-margin-top: 80px` on all sections (accounts for fixed nav)

---

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| Mobile (<768px) | Single column grids, hero heading → `hero-heading-mobile` (48px), buttons stack vertically, nav links hidden, margins → 16px |
| Tablet (768-1024px) | 2-column grids where applicable |
| Desktop (>1024px) | Full layout as designed: 3-4 column grids, max-width 1280px centered |

---

## File Structure for React Implementation

```
frontend/src/
├── pages/
│   └── Landing.tsx                  # Main landing page (all sections composed)
├── components/
│   └── landing/
│       ├── Navbar.tsx               # Fixed navigation
│       ├── HeroSection.tsx          # Hero + terminal
│       ├── TerminalAnimation.tsx    # Typewriter terminal component
│       ├── ProblemSection.tsx       # Stats + quote
│       ├── SolutionSection.tsx      # Before/After comparison
│       ├── HowItWorks.tsx           # 4-step process
│       ├── ArchitectureSection.tsx  # Agent tree diagram
│       ├── SplunkIntegration.tsx    # Feature list + grid
│       ├── ImpactMetrics.tsx        # Count-up numbers
│       ├── TechStackStrip.tsx       # Scrolling badges
│       └── Footer.tsx               # Footer
├── hooks/
│   ├── useIntersectionObserver.ts   # Scroll-triggered animations
│   └── useCountUp.ts               # Number animation hook
├── styles/
│   └── landing.css                  # Custom CSS (glow, dot-grid, dashed-connector)
└── assets/
    └── (none — all icons via Material Symbols CDN or lucide-react)
```

---

## Implementation Notes

1. **No image assets needed** — everything is built with CSS, Material Symbols, and HTML.
2. **No Demo/Video section in stitch** — the stitch skips directly from Impact to Tech Stack to Footer. Add a video section between Impact and Tech Stack when the demo video is ready.
3. **No CTA section in stitch** — the "Launch Dashboard" button in the nav and hero serves as the CTA. Add a dedicated CTA section above the footer if needed for submission.
4. **Infinite scroll animation** for tech stack requires a CSS keyframe that translates the strip horizontally. Duplicate the items for seamless looping.
5. **Material Symbols** are loaded via Google Fonts CDN in the stitch. For React, either keep the CDN link or switch to `lucide-react` icons mapped to equivalent meanings.
