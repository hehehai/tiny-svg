# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tiny SVG is a web-based SVG optimizer and code generator built with TanStack Start, React 19, and TypeScript. It optimizes SVGs using SVGO and generates framework-specific code (React, Vue, Svelte, React Native, Flutter).

**Tech Stack:**
- Framework: TanStack Start (SSR with file-based routing)
- UI: React 19, Tailwind CSS 4, Radix UI, shadcn/ui
- State: Zustand
- i18n: Intlayer (EN, ZH, KO, DE, FR)
- Build: Vite 7, pnpm workspaces (pnpm@10.14.0)
- Linting: Biome + Ultracite
- Deployment: Vercel (Cloudflare Workers not supported due to MDX `eval()` restrictions)

## Common Commands

```bash
# Development
pnpm dev              # Start all workspace apps
pnpm dev:web          # Start only web app (port 3001)

# Build
pnpm build            # Build all packages
pnpm --filter web build   # Build web app only
pnpm --filter web serve   # Preview production build locally

# Code Quality
pnpm check            # Run Biome linter/formatter (auto-fix)
pnpm check-types      # TypeScript type checking across all workspaces

# Internationalization
pnpm exec intlayer build  # Build i18n dictionaries (run from apps/web)
```

## Architecture

```
tiny-svg/
├── apps/web/                    # Main web application
│   ├── src/
│   │   ├── components/          # React components (UI, optimize, lazy-loaded)
│   │   ├── contents/            # i18n definitions (*.content.ts)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities and helpers
│   │   │   ├── worker-utils/        # Worker client interfaces
│   │   │   ├── svg-to-code.ts       # Framework code generators
│   │   │   ├── svg-transform.ts     # SVG transformations (rotate, flip, resize)
│   │   │   ├── svgo-plugins.ts      # SVGO plugin configurations
│   │   │   └── file-utils.ts        # File handling utilities
│   │   ├── routes/              # TanStack Start file-based routing
│   │   │   ├── __root.tsx           # Root layout
│   │   │   ├── {-$locale}/          # Locale-prefixed routes (e.g., /en, /zh)
│   │   │   └── og.tsx               # Open Graph image generation
│   │   ├── store/               # Zustand stores
│   │   │   ├── svg-store.ts         # SVG content, optimization settings, transformations
│   │   │   └── ui-store.ts          # UI state (theme, panels, preferences)
│   │   └── workers/             # Web Workers for heavy tasks
│   │       ├── svgo.worker.ts       # SVG optimization (SVGO runs here)
│   │       ├── prettier.worker.ts   # Code formatting (Prettier runs here)
│   │       └── code-generator.worker.ts  # Framework code generation
│   ├── intlayer.config.ts       # i18n config (locales, editor settings)
│   └── package.json             # Web app dependencies
└── package.json                 # Root workspace config
```

## Key Patterns

### Internationalization
- Define translations in `*.content.ts` files using `t()` function with keys for each locale
- Access translations with `useIntlayer('contentName')` hook
- Supported locales: EN, ZH, KO, DE, FR (configured in `intlayer.config.ts`)
- Routes use `{-$locale}` pattern for locale-based routing (e.g., `/en/about`, `/zh/about`)
- After adding/modifying content files, run `pnpm exec intlayer build` from `apps/web`

### Web Workers
Heavy operations run in Web Workers to avoid blocking the main thread:
- **Worker files** (`apps/web/src/workers/`): Contain actual worker logic
- **Worker clients** (`apps/web/src/lib/worker-utils/`): Provide type-safe interfaces to communicate with workers
- **Worker manager** (`worker-manager.ts`): Handles worker lifecycle and instance management
- SVGO optimization, Prettier formatting, and code generation all execute in dedicated workers
- IMPORTANT: SVGO library is NOT imported in main bundle, only in `svgo.worker.ts` to keep bundle size small

### State Management
- `svg-store.ts`: SVG content, optimization settings, transformations, SVGO config
  - Note: Stores SVGO config but doesn't import SVGO library itself
- `ui-store.ts`: UI state (theme, panels, preferences)
- Uses Zustand for simple, performant state management without boilerplate

## Code Style

This project uses **Ultracite** with **Biome** for strict linting. Run `pnpm check` to auto-fix issues.

**Key rules enforced:**
- Use `import type` for type imports
- Use `export type` for type exports
- No TypeScript enums (use `as const` objects instead)
- No `any` type (disabled in biome.json for pragmatic reasons, but avoid when possible)
- No non-null assertions (`!`)
- Use `for...of` instead of `Array.forEach`
- Use arrow functions over function expressions
- Always include `type` attribute on buttons
- Include `title` attribute for accessibility on interactive elements

**Overrides in biome.json:**
- `noExplicitAny`: off (pragmatic exception)
- `noReactForwardRef`: off (React 19 compatibility)
- `noDangerouslySetInnerHtml`: off (needed for SVG rendering)
- Console methods: `warn`, `info`, `error` allowed
