# Tiny SVG

<div align="center">

<img src="./docs/images/logo.png" alt="Tiny SVG Logo" width="120" height="120" />

**A modern, lightning-fast SVG optimizer and code generator**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-SSR-orange.svg)](https://tanstack.com/start)

</div>

## Features

### Web Application
- **SVG Optimization** - SVGO-powered with 40+ configurable plugins
- **Code Generation** - React (JSX/TSX), Vue, Svelte, React Native, Flutter
- **Transformations** - Rotate, flip, resize with proportional scaling
- **Data URI Export** - Minified, Base64, URL-encoded formats
- **Visual Preview** - Real-time preview with zoom (20%-400%) and pan
- **Export** - PNG/JPEG with customizable dimensions (0.25x-8x scale)
- **PWA** - Installable, offline-capable with auto-caching
- **i18n** - English, Chinese, Korean, German, French

#### Home Page
![Home Page](./docs/images/home.webp)

#### Optimize Page
![Optimize Page](./docs/images/optimize.webp)
![Optimize Page Code](./docs/images/optimize-code.webp)

### Figma Plugin
- **Native Integration** - Optimize SVGs directly in Figma
- **Batch Processing** - Handle multiple SVG layers at once
- **Real-time Preview** - Side-by-side diff viewer with syntax highlighting
- **Compression Presets** - Default, Aggressive, Minimal, or Custom configurations
- **In-place Replacement** - Update SVGs directly in your Figma designs
- **Code Export** - Generate framework-specific code within Figma

#### Screenshots
![Plugin](./docs/images/figma-plugin.webp)

## Quick Start

### Prerequisites

- **Node.js**: >= 18.x
- **pnpm**: >= 10.x

### Installation

```bash
# Clone the repository
git clone https://github.com/hehehai/tiny-svg.git
cd tiny-svg

# Install dependencies
pnpm install
```

### Development

```bash
# Start all workspace apps
pnpm dev

# Or start specific apps
pnpm dev:web          # Web app only (http://localhost:3001)
pnpm dev:figma        # Figma plugin in watch mode
```

**For Figma Plugin development:**
1. Run `pnpm build:packages` to build shared packages
2. Run `pnpm dev:figma` to start development mode
3. In Figma Desktop: **Plugins → Development → Import plugin from manifest...**
4. Select `apps/figma-plugin/manifest.json`

### Build

```bash
# Build all workspace packages
pnpm build

# Build specific targets
pnpm build:packages   # Shared packages only
pnpm build:figma      # Figma plugin
pnpm --filter @tiny-svg/web build   # Web app only

# Preview the web app production build
pnpm --filter @tiny-svg/web serve
```

### Code Quality

```bash
# Check and fix issues
pnpm check

# Type check all packages
pnpm check-types
```

## Tech Stack

### Core Framework
- **[TanStack Start](https://tanstack.com/start)** - Modern SSR framework with file-based routing
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component collection

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching

### Optimization & Processing
- **[SVGO](https://github.com/svg/svgo)** - SVG optimization engine
- **[Prettier](https://prettier.io/)** - Code formatter for generated code
- **[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)** - Multi-threaded processing

### Build & Deploy
- **[Vite 7](https://vite.dev/)** - Next-generation build tool
- **[Vercel](https://vercel.com/)** - Deployment platform

## Project Structure

This is a **pnpm monorepo** with shared packages for code reuse across applications.

```
tiny-svg/
├── apps/
│   ├── web/                    # Web application (TanStack Start)
│   │   ├── src/
│   │   │   ├── components/         # React components
│   │   │   ├── contents/           # i18n definitions (*.content.ts)
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   ├── lib/                # Utilities and helpers
│   │   │   ├── routes/             # File-based routing
│   │   │   │   └── {-$locale}/     # Locale-prefixed routes
│   │   │   ├── store/              # Zustand stores
│   │   │   └── workers/            # Web Workers (optimization, formatting)
│   │   └── package.json
│   │
│   └── figma-plugin/           # Figma plugin
│       ├── src/
│       │   ├── plugin.ts           # Plugin sandbox code (Figma API)
│       │   └── ui/                 # React UI components
│       ├── manifest.json           # Figma plugin manifest
│       └── package.json
│
└── packages/                   # Shared packages
    ├── svg/                        # @tiny-svg/svg
    │   └── src/                    # SVGO config, presets, utilities
    ├── code-generators/            # @tiny-svg/code-generators
    │   └── src/                    # Framework code generators (React, Vue, Svelte, etc.)
    ├── ui/                         # @tiny-svg/ui
    │   └── src/                    # Shared React components (diff viewer, etc.)
    └── utils/                      # @tiny-svg/utils
        └── src/                    # Utilities (clipboard, image export, etc.)
```

### Package Dependencies

- **Web app** depends on: `@tiny-svg/svg`, `@tiny-svg/code-generators`, `@tiny-svg/ui`
- **Figma plugin** depends on: `@tiny-svg/svg`, `@tiny-svg/code-generators`, `@tiny-svg/ui`, `@tiny-svg/utils`

**Important:** After modifying any package in `packages/`, run `pnpm build:packages` before building apps.

## Deployment

Deployed on **Vercel** for full SSR support. Cloudflare Workers not supported due to MDX runtime restrictions (`eval()` prohibited).

## Applications

### 🌐 Web Application
[Visit Tiny SVG](https://tiny-svg.vercel.app)

A full-featured web application for SVG optimization with SSR, PWA support, and i18n.

### 🎨 Figma Plugin
[![Install Plugin](https://img.shields.io/badge/Figma-Install_Plugin-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/community/plugin/1577284420062305768)

Optimize SVGs directly within Figma with our official plugin. Available now on Figma Community!

**[→ Install from Figma Community](https://www.figma.com/community/plugin/1577284420062305768)**

See [apps/figma-plugin/README.md](apps/figma-plugin/README.md) for development details.

## TODO

- [ ] SVG share - Generate shareable links with expiration
- [ ] SVG history - Track previously optimized SVGs with restore
- [ ] Interactive plugin demos - Visual examples for SVGO plugins
- [ ] SVG sprite generator - Combine multiple SVGs into sprite sheets
- [ ] Accessibility checker - Analyze and suggest SVG accessibility improvements

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## License

[MIT](./LICENSE)

## Acknowledgments

- **[SVGO](https://github.com/svg/svgo)** - SVG optimization engine
- **[TanStack](https://tanstack.com/)** - React ecosystem (Router, Start, Query)
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[shadcn/ui](https://ui.shadcn.com/)** - UI components
- **[Tailwind CSS](https://tailwindcss.com/)** - CSS framework
- **[Biome](https://biomejs.dev/)** - Linter and formatter

## Code Template

Start with the same template: [tiny-svg start template](https://better-t-stack.dev/stack?name=my-better-t-app&fe-w=tanstack-start&fe-n=none&rt=none&be=none&api=none&db=none&orm=none&dbs=none&au=none&pay=none&pm=bun&add=biome%2Cultracite&ex=&git=true&i=true&wd=none&sd=vercel&yolo=false)

---

<div align="center">

Made with ❤️ by developers, for developers

**[⬆ Back to Top](#tiny-svg)**

</div>
