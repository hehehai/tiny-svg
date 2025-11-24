# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tiny SVG is a web-based SVG optimizer and code generator built with TanStack Start, React 19, and TypeScript. It optimizes SVGs using SVGO and generates framework-specific code (React, Vue, Svelte, React Native, Flutter).

**Tech Stack:**
- Framework: TanStack Start (SSR with file-based routing)
- UI: React 19, Tailwind CSS 4, Radix UI, shadcn/ui
- State: Zustand
- i18n: Intlayer (EN, ZH, KO, DE)
- Build: Vite 7, pnpm workspaces
- Linting: Biome + Ultracite

## Common Commands

```bash
# Development
pnpm dev              # Start all workspace apps
pnpm dev:web          # Start only web app (port 3001)

# Build
pnpm build            # Build all packages
pnpm --filter web build   # Build web app only

# Code Quality
pnpm check            # Run Biome linter/formatter (auto-fix)
pnpm check-types      # TypeScript type checking

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
│   │   ├── lib/                 # Utilities (SVGO config, code generators)
│   │   ├── routes/              # TanStack Start file-based routing
│   │   │   └── {-$locale}/      # Locale-prefixed routes
│   │   ├── store/               # Zustand stores (svg-store, ui-store)
│   │   └── workers/             # Web Workers for heavy tasks
│   │       ├── svgo.worker.ts       # SVG optimization
│   │       ├── prettier.worker.ts   # Code formatting
│   │       └── code-generator.worker.ts  # Framework code generation
│   └── intlayer.config.ts       # i18n config
└── package.json                 # Root workspace config
```

## Key Patterns

### Internationalization
- Define translations in `*.content.ts` files using `t()` function
- Access translations with `useIntlayer('contentName')` hook
- Routes use `{-$locale}` pattern for locale-based routing

### Web Workers
Heavy operations (SVGO, Prettier, code generation) run in Web Workers to avoid blocking the main thread. Worker utilities are in `apps/web/src/lib/`.

### State Management
- `svg-store.ts`: SVG content, optimization settings, transformations
- `ui-store.ts`: UI state (theme, panels, preferences)

## Code Style

This project uses Ultracite with Biome for strict linting. Key rules:
- Use `import type` for type imports
- Use `export type` for type exports
- No TypeScript enums (use `as const` objects)
- No `any` type
- No non-null assertions (`!`)
- Use `for...of` instead of `Array.forEach`
- Use arrow functions over function expressions
- Always include `type` attribute on buttons
- Include `title` element for SVG accessibility
