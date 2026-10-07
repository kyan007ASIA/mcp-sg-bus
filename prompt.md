# Singapore Public Transit Expressive - User Prompts Log

This document records all the prompts used to build, configure, version-control, and extend this project.

---

## Prompt 1: Initial App Creation & Design System Specification

**Request:**
```text
Build me an app with screens that look like this. You can hotlink images from the html
```

**Design System & Style Specifications Provided:**
```yaml
name: Singapore Public Transit Expressive
colors:
  surface: '#fbf8fc'
  surface-dim: '#dcd9dd'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f7'
  surface-container: '#f0edf1'
  surface-container-high: '#ECEFF1'
  surface-container-highest: '#e4e1e5'
  on-surface: '#1b1b1e'
  on-surface-variant: '#4f434e'
  inverse-surface: '#303033'
  inverse-on-surface: '#f3f0f4'
  outline: '#81737f'
  outline-variant: '#d3c1d0'
  surface-tint: '#8e3c98'
  primary: '#4e005a'
  on-primary: '#ffffff'
  primary-container: '#6b1a77'
  on-primary-container: '#e68bed'
  inverse-primary: '#fbabff'
  secondary: '#bb0027'
  on-secondary: '#ffffff'
  secondary-container: '#e51a38'
  on-secondary-container: '#fffbff'
  tertiary: '#003124'
  on-tertiary: '#ffffff'
  tertiary-container: '#004a38'
  on-tertiary-container: '#61bd9e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd6fd'
  primary-fixed-dim: '#fbabff'
  on-primary-fixed: '#36003e'
  on-primary-fixed-variant: '#72227e'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b1'
  on-secondary-fixed: '#410007'
  on-secondary-fixed-variant: '#92001d'
  tertiary-fixed: '#98f4d3'
  tertiary-fixed-dim: '#7cd8b8'
  on-tertiary-fixed: '#002117'
  on-tertiary-fixed-variant: '#00513e'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e1e5'
  transit-purple-deep: '#4E1257'
  transit-purple-light: '#F5EBF7'
  brand-accent-red: '#ED1C24'
  crowd-green: '#00875A'
  crowd-amber: '#D97706'
  crowd-red: '#DC2626'
  transit-blue-mrt: '#0284C7'
  surface-card: '#FFFFFF'
  surface-canvas: '#F8F9FA'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
  service-badge:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 28px
    letterSpacing: -0.03em
  countdown-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '800'
    lineHeight: 24px
    letterSpacing: -0.02em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-badge:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  stop-code:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
```

```markdown
## Brand & Style

This design system establishes an authentic, high-efficiency Singapore municipal transport aesthetic rooted in SBS Transit's iconic visual identity. Designed for millions of daily commuters navigating dense urban journeys across buses, interchanges, and MRT lines, the interface delivers calm certainty under high-glare outdoor conditions, rapid glanceability at transit stops, and civic reliability.

The design style is Corporate / Modern utilitarian, infused with structured transit wayfinding cues:
- Functional Civic Authority: Clean white and warm alabaster surfaces paired with the authoritative deep SBS Transit royal purple.
- Glance-and-Go Typography: High-contrast, tabular data figures for stop IDs, countdown timers, and bus service badges.
- Micro-Information Density: Compact telemetry chips detailing deck configuration (Single, Double Decker), wheelchair accessibility (WAB), and live occupancy tiers (Seats Available, Standing Available, Limited Standing).
- Tactile Public Infrastructure: Solid card containers, high contrast borders for sunlight legibility, and unmistakable energetic scarlet accents.

## Colors

The color palette centers around SBS Transit's heritage purple `#6B1A77` (with deep tonal grounding at `#4E1257`), balanced by an energetic civic red `#E31837` for critical alerts, route markers, and urgency signals.

### Color Roles & Semantics
- Primary (`#6B1A77`): Primary navigation headers, top-tier service route emblems, key action triggers, and primary card titles.
- Secondary (`#E31837`): Imminent bus arrivals ("Arr", "1 min"), service disruption notices, live tracking indicators, and emergency broadcasts.
- Tertiary (`#0D7A5F`): Standard LTA-aligned operational health indicators, normal arrival states, and accessibility green.
- Neutral (`#212124`): High-legibility neutral text ensuring a contrast ratio exceeding 7:1 against card backgrounds.
- Crowd Density Semantics:
  - crowd-green (`#00875A`): Seats available (Low occupancy).
  - crowd-amber (`#D97706`): Standing available (Medium occupancy).
  - crowd-red (`#DC2626`): Limited standing / full capacity.

## Typography

The typography couples Plus Jakarta Sans for expressive, commanding headlines, interchange route wayfinding, and bus service badges with Inter for dense, tabular information arrays and system metrics.

- Tabular Figures: All arrival times and 5-digit bus stop codes (e.g., B64009, B03211) must enforce `font-feature-settings: 'tnum' on` to prevent layout reflow during live 60-second refreshes.
- Service Badges (`service-badge`): Bold, geometric bus route numbers designed for rapid scanning while walking down MRT platforms or bus shelters.
- Accessibility Readability: Strict adherence to generous x-heights to aid visually impaired commuters navigating in Singapore's bright equatorial sunlight.

## Layout & Spacing

The layout operates on an 8-point spatial cadence tailored for handheld transit utility and outdoor responsiveness:

- Mobile First Framework: Fixed viewport margins of 1rem (16px) maximize information area on screens under 600px width.
- Card-List Stacking: Real-time bus stop dashboards stack services with a constant vertical gap of space-sm (8px) to allow effortless single-hand thumb navigation.
- Tablet & Desktop: Fluid 12-column grid transitioning at 768px and 1024px, locking max content container width to 1180px centered with margin-desktop (32px).
- Touch Targets: Interactive route pills, map toggle chips, and bookmark stars enforce a minimum interactive footprint of 44×44px.

## Elevation & Depth

Visual hierarchy uses tonal layering complemented by subtle ambient shadows to simulate durable civic signage plaques:

- Canvas Base: Soft tinted cool white (`#F8F9FA`) ensures high contrast against cards without ocular glare.
- Container Level 1 (Bus Stop / Service Cards): Crisp pure white (`#FFFFFF`) with a delicate hairline border (`1px solid rgba(0, 0, 0, 0.08)`) and an ultra-soft ambient shadow.
- Container Level 2 (Active Arrival Panels / Sheets): Elevated layer for pinned routes and live modal sheets with `0 8px 24px rgba(107, 26, 119, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)`.
- Top Bar / Search Island: High-clarity frosted backdrop (`rgba(255, 255, 255, 0.92)` with `backdrop-filter: blur(12px)`) elevated with a subtle bottom divider.

## Shapes

- Cards & Service Panels: Medium rounded-md (8px) to rounded-lg (16px).
- Bus Route Badges: Dedicated rounded-md (6px to 8px) rectangular shields recalling physical bus interchange signage.
- Feature Pills & Accessibility Tags: Fully pill-shaped (`rounded-full`) for quick categorical identification (e.g., WAB, DD, SD).
- Interactive Buttons: Solid 8px rounded corners for primary actions.

## Components

### 1. Bus Service Arrival Card
- Left (Service Identity): Prominent rectangular badge with purple background (`#6B1A77`), crisp white bold numerals (`service-badge`), and underlying destination subtitle.
- Center (Next Bus & Telemetry): Next bus arrival indicator featuring high-impact red/green status badges, alongside telemetry tags:
  - WAB (Wheelchair Accessible): Tiny icon badge with dark neutral outline.
  - Vehicle Type: Small neutral pill denoting DD (Double Decker) or SD (Single Decker).
  - Occupancy Dot: Micro colored dot denoting seat availability.
- Right (Subsequent Arrivals): Secondary & Tertiary bus arrival times arranged in compact tabular columns (e.g., 5 mins, 14 mins).

### 2. Service Buttons & Action Bar
- Primary Button: Background in signature SBS purple (`#6B1A77`), text white, 48px height, space-md horizontal padding, 8px radius.
- Secondary / Emergency Alert Action: Border in `#E31837`, text `#E31837`, transparent fill; active states tint with `#FDE8EA`.
- A+ / A- Font Resizer Group: Segmented pill container with discrete accessibility scale controls as seen on official SBS Transit portals.

### 3. Chips & Metadata Badges
- Crowding Status Chips:
  - Seats Available: `#E6F4EA` background, `#00875A` text and indicator.
  - Standing Available: `#FEF3C7` background, `#D97706` text and indicator.
  - Crowded: `#FEE2E2` background, `#DC2626` text and indicator.
- Route Filter Chips: Smooth white chips with `1px solid rgba(0,0,0,0.12)`, turning solid `#6B1A77` with white text when active.

### 4. Input & Station Search Bar
- Search Header: Clean, rounded input field with an embedded search glyph, 44px height, light gray border `#D1D5DB`, placeholder "Search bus service, stop name, or 5-digit code...". Focus state uses a 2px outer glow in `#6B1A77`.

### 5. Wayfinding Stop Header Banner
- Distinctive purple banner block (`#6B1A77`) featuring white typography, presenting the 5-digit bus stop identifier (e.g., Opp Orchard Stn - 09023), road description, and quick bookmark toggle.
```

---

## Prompt 2: GitHub Repository Push

**Request:**
```text
git push [GITHUB_PERSONAL_ACCESS_TOKEN]@https://github.com/kyan007ASIA/mcp-sg-bus.git
```

*Note: Initialized local git repository on branch `main`, committed initial codebase, configured remote origin, pushed commit, and sanitized local remote URLs.*

---

## Prompt 3: Backend API Architecture & LTA DataMall v3 Integration

**Request:**
```text
1) create a /api folder under the project main to store all the apis
2) create a /api/health.js to monitor if the apis are working
3) integrate the LTA bus information api endpoint GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
Header:  AccountKey:

# BusStopCode is the only required parameter.
# Add &ServiceNo=7 to ask about one service only.
# Refreshes every 20 seconds. JSON comes back by default.
I will add the LTA_ACCOUNT_KEY in vercel environment variables later
```

---

## Prompt 4: Prompts Documentation

**Request:**
```text
create a prompt.md containing all my prompt located at project main
```
