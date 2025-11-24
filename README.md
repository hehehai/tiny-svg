# Tiny SVG

<div align="center">

<img src="./docs/images/logo.png" alt="Tiny SVG Logo" width="120" height="120" />

**A modern, lightning-fast SVG optimizer and code generator**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-SSR-orange.svg)](https://tanstack.com/start)

</div>

## Features

- **SVG Optimization** - SVGO-powered with 40+ configurable plugins
- **Code Generation** - React (JSX/TSX), Vue, Svelte, React Native, Flutter
- **Transformations** - Rotate, flip, resize with proportional scaling
- **Data URI Export** - Minified, Base64, URL-encoded formats
- **Visual Preview** - Real-time preview with zoom (20%-400%) and pan
- **Export** - PNG/JPEG with customizable dimensions (0.25x-8x scale)
- **PWA** - Installable, offline-capable with auto-caching
- **i18n** - English, Chinese, Korean, German

## Screenshots

### Home Page
![Home Page](./docs/images/home.webp)

### Optimize Page
![Optimize Page](./docs/images/optimize.webp)
![Optimize Page Code](./docs/images/optimize-code.webp)

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

# Or start only the web app
pnpm dev:web
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build

```bash
# Build all workspace packages
pnpm build

# Preview the production build locally
pnpm --filter web serve
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

```
apps/web/src/
├── components/     # React components
├── contents/       # i18n definitions (*.content.ts)
├── hooks/          # Custom React hooks
├── lib/            # Utilities (SVGO config, code generators)
├── routes/         # TanStack Start file-based routing
│   └── {-$locale}/ # Locale-prefixed routes
├── store/          # Zustand stores
└── workers/        # Web Workers (svgo, prettier, code-generator)
```

## Deployment

Deployed on **Vercel** for full SSR support. Cloudflare Workers not supported due to MDX runtime restrictions (`eval()` prohibited).

```bash
cd apps/web && pnpm deploy
```

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
