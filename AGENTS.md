# Kamomi Frontend — Agent Rules

Astro 7 + React 19 + Tailwind CSS 4 + TanStack Query. The UI is built on **`@pradnyakuswara/ui`** (design tokens + components). Additional workflow rules live in [.agents](.agents).

## Stack & Commands
- Node >= 22.12, package manager **npm** (`package-lock.json`).
- `npm run dev` — dev server · `npm run build` — build · `npm run preview`.

## Directory Structure
- `src/pages/` — Astro routes (thin wrappers only: HTML, SEO, mounting React islands).
- `src/components/` — React components (`dashboard/`, `guest/`, `input/`, `modal/`, `ui/`, `brand/`, `auth/`, ...).
- `src/types/` — shared types/interfaces. `src/hooks/` — custom hooks. `src/rest/` & `src/services/` — API layer (React Query + fetchers).
- `src/styles/global.css` — the single global CSS entry point.

## Design System: `@pradnyakuswara/ui` (MANDATORY)
- **Never** use MUI (`@mui/*`), `@emotion/*`, or any other UI library (Chakra, Ant, styled Radix, etc.). Do not re-add them.
- Import UI components from `@pradnyakuswara/ui`, e.g. `Button`, `Modal`, `Drawer`, `Alert`, `Badge`, `Card*`, `Stat`, `Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `Switch`, `Tabs*`, `SegmentedControl`, `FilterChip`, `Table`, `Pagination`, `Tooltip`, `Popover`, `DropdownMenu`, `Skeleton`, `Spinner`, `EmptyState`, `Stepper`, `CommandPalette`, `ToastProvider`/`useToast`.
- **Check what the library provides first** (`node_modules/@pradnyakuswara/ui/dist/index.d.mts`) before writing your own component. Only build a custom component when the library has no equivalent, and wrap it under `src/components/`.
- The library stylesheet is imported exactly once, in [src/styles/global.css](src/styles/global.css) (`@import '@pradnyakuswara/ui/styles.css'`). Do not import it again.
- Valid variants: Button `primary|secondary|outline|ghost|danger`; Badge `default|primary|secondary|success|warning|danger|outline`; Alert `info|success|warning|danger`; Toast `default|success|warning|danger`. Loading state → `isLoading`; icons → `leftIcon`/`rightIcon`.
- Modal: `open`, `onClose`, `title`, `footer`, `size="sm|md|lg"`. A submit button in the footer targets its form with `form="<id>"`.
- Toasts: one system. Call `toast.success/error/info/warning(...)` from [src/hooks/useToast.ts](src/hooks/useToast.ts) (imperative API). Rendering is done by the library's `ToastProvider` through [ToastContainer](src/components/layout/ToastContainer.tsx) — render a single `<ToastContainer />` per island/page and never create your own `ToastProvider`.
- Icons: `lucide-react` (not `@mui/icons-material`).

## Design Tokens
- Use the library's CSS variables instead of new hex/hardcoded colors:
  - Colors: `--color-primary`, `--color-primary-hover`, `--color-primary-soft`, `--color-brand`, `--color-danger*`, `--color-warning*`, `--color-success*`, `--color-info*`.
  - Semantic (theme-aware): `--bg-base`, `--bg-surface`, `--bg-subtle`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border-color`, `--border-subtle`, `--primary-accent` (primary blue in light mode, lighter blue in dark mode — use it for blue text/icons).
  - Shape: `--radius-xs…xl`, `--shadow-1…3`; font: `--font-sans`.
- In Tailwind use arbitrary values: `bg-[var(--bg-surface)]`, `text-[var(--text-primary)]`, `border-[var(--border-color)]`.
- The `@theme` block in [global.css](src/styles/global.css) maps the legacy Tailwind palette (`slate-*`, `cyan-*`, `rose-*`, `emerald-*`, `amber-*`, …), `rounded-*` and the font to library tokens, so legacy classes automatically follow tokens and the theme. **New code must still use library components + `var(--token)`**, not palette classes.
- Shared components already built on the library (reuse them, don't rebuild): `input/*` (FormInput, FormTextarea, FormSelect, InputEmail/Password/Phone, SelectRole), `modal/*`, `ui/*` (Pagination, EmptyState, LoadingState, ErrorState), `button/TooltipButton`, `layout/ToastContainer`, `dashboard/modal/CommandPaletteModal`, `dashboard/sidebar/RoomLogsSidebar` (Drawer), `brand/Logo`.
- Migration status: all dashboard `.tsx` files, shared components and the marketing `DashboardShowcase` use library `Button`/`Input`/`Modal`/`Drawer`/`Tabs`/`SegmentedControl`/`FilterChip`/`Checkbox`/`Switch`/`Badge`/`Avatar`/`Card`/`Stat`/`Table`. Intentionally left native: structural elements (FAQ/rule accordions, wizard choice cards, sidebar toggle) and static `.astro` marketing pages (`index/features/pricing/guest/blog`, Footer). Those already take their colors from the token mapping and should be moved to library components only if they become React islands.

## Logo & Brand
- The Kamomi.id logo is the "Origami Gull" mark (a kamome/seagull folded from origami, two-tone, no background tile) in `--primary-accent` (primary blue in light mode, lighter blue in dark mode) plus a wordmark. Use [Logo / LogoMark](src/components/brand/Logo.tsx) (`tone="light"` → white mark and text for colored backgrounds). Do not use `<img src="/logo.png">` for UI.
- Static assets: `public/logo.svg`, `logo-mark.svg`, `favicon.svg`, `logo-full.svg`, `logo-full-dark.svg`. The PNGs (`logo.png`, favicons, `apple-touch-icon`, `android-chrome`, `favicon.ico`) are rendered from the same SVG with `rsvg-convert`; re-render all of them whenever the mark changes.
- Tailwind classes placed on library components (e.g. `Button`) that clash with their built-in styles (such as `hidden` / `md:hidden`) need the important modifier: `md:hidden!`.

## Theme (Dark Mode)
- Tailwind uses the `dark` class; the library uses `data-theme="dark|light"` on `<html>`. **Both must always stay in sync**: change the theme only through `useTheme()` ([src/hooks/useTheme.ts](src/hooks/useTheme.ts)) and the inline script in [SEOHead.astro](src/components/layout/SEOHead.astro). Never toggle only one of them.

## Code Conventions
- Strict TypeScript; use the types from `src/types/`, avoid `any`.
- New feature flow: Types → Components → Astro route → Wire up API/state.
- Keep heavy client logic in React components, not in Astro `<script>` tags. Hydration: `client:load` or `client:only="react"`.
- Styling: mobile-first Tailwind + library tokens. No CSS-in-JS.
- Client-side env vars must be prefixed with `PUBLIC_` (`import.meta.env.PUBLIC_API_URL`).
- User-facing UI copy is written in Indonesian.
- Data fetching goes through React Query hooks in `src/rest/`. Any island that uses those hooks must be wrapped in a `QueryClientProvider` (use `queryClient` from `src/rest/queryClient.ts`).

## Git
- Commits follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`), matching the repo history.
