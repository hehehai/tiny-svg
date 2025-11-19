# Tiny SVG

<div align="center">

<img src="./docs/images/logo.png" alt="Tiny SVG Logo" width="120" height="120" />

**A modern, lightning-fast SVG optimizer and code generator**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-SSR-orange.svg)](https://tanstack.com/start)

[Features](#features) · [Quick Start](#quick-start) · [Documentation](#documentation)

</div>

---

## 📖 Overview

**Tiny SVG** is a powerful web application for optimizing SVG files and generating framework-specific code. Built with modern web technologies, it provides a seamless experience for developers and designers working with SVG assets.

### ✨ Key Features

- **🚀 SVG Optimization**: Powered by SVGO with 40+ configurable plugins
- **📦 Code Generation**: Generate React (JSX/TSX), Vue, Svelte, React Native, and Flutter code
- **🎨 SVG Transformations**: Rotate, flip (horizontal/vertical), and resize with proportional scaling
- **📊 Data URI Export**: Generate minified, base64, and URL-encoded Data URIs with size comparison
- **🔍 Code Diff Viewer**: Side-by-side comparison with syntax highlighting (powered by Refractor)
- **⚡ Web Workers**: Non-blocking optimization using multi-threaded processing
- **🎨 Visual Preview**: Real-time preview with zoom (20%-400%), pan, and 4 background styles
- **📐 Export Dimensions**: Customizable PNG/JPEG export with scale presets (0.25x-8x) and custom dimensions
- **💾 Persistent Settings**: Your preferences saved across sessions
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🌓 Dark Mode**: Full dark mode support
- **🌍 Internationalization**: Multi-language support (EN, ZH, KO, DE)
- **⚡ Lightning Fast**: Optimized bundle with lazy loading and code splitting (main route only 15.79 KB)

---

## 📸 Screenshots

### Home Page
![Home Page](./docs/images/home.webp)

Simple, intuitive interface to get started quickly.

### Optimize Page
![Optimize Page](./docs/images/optimize.webp)

Powerful optimization tools with real-time preview and code generation.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.x (or use Bun runtime)
- **Bun**: >= 1.0.0 (recommended package manager and runtime)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tiny-svg.git
cd tiny-svg

# Install dependencies
bun install
```

### Development

This is a **Bun workspace** monorepo. Start the development server:

```bash
# Start all workspace apps (runs in all apps/*)
bun dev

# Or start only the web app
bun dev:web
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build

Build for production:

```bash
# Build all workspace packages
bun run build

# Or build only the web app
bun --filter web build

# Preview the production build locally
bun --filter web serve
```

Build output will be in `apps/web/.output/`:
- `client/` - Static client assets
- `server/` - Server-side code for SSR

### Code Quality

Run linting and formatting:

```bash
# Check and fix issues (runs on entire workspace)
bun run check

# Type check all packages
bun run check-types
```

---

## 🏗️ Tech Stack

### Core Framework
- **[TanStack Start](https://tanstack.com/start)** - Modern SSR framework with file-based routing
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component collection
- **[Iconify](https://iconify.design/)** - Unified icon framework

### Internationalization
- **[Intlayer](https://intlayer.org/)** - Type-safe i18n library for React
- **Languages Supported**: English, Chinese (简体中文), Korean (한국어), German (Deutsch)

### State Management & Data
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Optimization & Processing
- **[SVGO](https://github.com/svg/svgo)** - SVG optimization engine
- **[Prettier](https://prettier.io/)** - Code formatter for generated code
- **[Refractor](https://github.com/wooorm/refractor)** - Lightweight syntax highlighting
- **[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)** - Multi-threaded processing

### Code Quality
- **[Biome](https://biomejs.dev/)** - Fast linter and formatter
- **[Ultracite](https://ultracite.dev/)** - Strict TypeScript configuration

### Build & Deploy
- **[Vite 7](https://vite.dev/)** - Next-generation build tool
- **[Vercel](https://vercel.com/)** - Deployment platform

---

## 📚 Features in Detail

### SVG Optimization

- **40+ SVGO Plugins**: Fine-grained control over optimization
- **Global Settings**: Configure precision, multipass, and prettify options
- **Real-time Preview**: See changes instantly with zoom controls
- **Compression Statistics**: View file size reduction and compression rate
- **Batch Processing**: Optimize multiple SVGs efficiently

### Code Generation

Generate optimized code for your favorite framework:

- **React JSX** - JavaScript components with proper imports
- **React TSX** - TypeScript components with full type safety and SVGProps
- **Vue** - Single File Components (.vue) with template and script sections
- **Svelte** - Svelte components with props spreading
- **React Native** - react-native-svg components with automatic tag conversion
- **Flutter** - flutter_svg widgets with SvgPicture.string

**Features:**
- Automatic component name generation from filename (kebab-case → PascalCase)
- `currentColor` support for single-color SVGs (enables theming)
- ViewBox preservation with fallback to "0 0 24 24"
- Proper default dimensions (1em for scalability)
- Framework-specific imports and type definitions

### Data URI Export

Convert optimized SVGs to three Data URI formats with size comparison:

1. **Minified Data URI**: Optimized `encodeURIComponent` with smart character replacements
   - Replaces %20 → space, %3D → =, %3A → :, %2F → /
   - Smallest size for most SVGs
2. **Base64 Data URI**: Standard Base64 encoding
   - Prefix: `data:image/svg+xml;base64,`
   - Better for binary-heavy SVGs
3. **URL Encoded Data URI**: Full `encodeURIComponent` encoding
   - Prefix: `data:image/svg+xml,`
   - Most compatible format

**Size Calculations:**
- Accurate Blob-based size measurement
- Human-readable formatting (B, KB, MB)
- Easy comparison to choose the best format

### Preview & Visualization

- **4 Background Styles**:
  - Transparent Light (checkerboard)
  - Transparent Dark (dark checkerboard)
  - Solid Light (white)
  - Solid Dark (dark gray)
- **Interactive Controls**:
  - Zoom: 20% - 400% zoom range with 20% steps
  - Pan: Click and drag to move SVG around
  - Rotate: 90° clockwise rotation with proper center calculations
  - Flip: Horizontal and vertical flip with scale transformations
  - Resize: Adjust width and height with proportional aspect ratio locking
- **SVG Transformation Engine** (`svg-transform.ts`):
  - DOMParser-based SVG manipulation
  - Preserves viewBox attributes during transformations
  - Handles both explicit width/height and viewBox-only SVGs
  - Reset functionality to restore original dimensions
- **Side-by-Side Comparison**: Compare original vs optimized
- **Code Diff View**: Refractor-powered syntax highlighting with unified diff format

### Performance Optimizations

- **Web Workers**: SVGO, Prettier, and code generation run in separate threads
- **Lazy Loading**: Components load on-demand (diff viewer, code viewer, config panel)
- **Code Splitting**: Optimized bundle chunking (refractor ~80KB, prettier ~200KB, svgo ~6KB, ui)
- **Result Caching**: Smart LRU cache with 5-minute TTL and 100-entry limit
- **Lightweight Syntax Highlighting**: Refractor instead of Monaco Editor (~200KB reduction)
- **Optimized Bundle**: Main optimize route only 15.79 KB (97.4% reduction from 611.74 KB)
- **Debounced Updates**: 150ms debounce on diff calculations to prevent excessive re-renders
- **Auto Tab Switching**: Automatically switches to "optimized" tab when compression completes

---

## 🗂️ Project Structure

```
tiny-svg/
├── apps/
│   └── web/                      # Main web application
│       ├── src/
│       │   ├── components/       # React components
│       │   │   ├── lazy/        # Lazy-loaded wrappers
│       │   │   ├── optimize/    # Optimize page components (6 files)
│       │   │   │   ├── code-tab-content.tsx
│       │   │   │   ├── data-uri-tab-content.tsx
│       │   │   │   ├── optimize-header.tsx
│       │   │   │   ├── optimize-layout.tsx
│       │   │   │   ├── optimize-tabs.tsx
│       │   │   │   └── compact-upload-button.tsx
│       │   │   ├── ui/          # Reusable UI components (shadcn/ui)
│       │   │   │   └── diff/    # Custom diff viewer
│       │   │   ├── svg-preview.tsx
│       │   │   ├── svg-size-adjuster.tsx
│       │   │   ├── code-viewer.tsx
│       │   │   ├── code-diff-viewer.tsx
│       │   │   └── config-panel.tsx
│       │   ├── contents/        # i18n content definitions (*.content.ts)
│       │   │   ├── home.content.ts
│       │   │   ├── about.content.ts
│       │   │   ├── blog.content.ts
│       │   │   └── optimize.content.ts
│       │   ├── hooks/           # Custom React hooks (12+ hooks)
│       │   │   ├── use-auto-compress.ts
│       │   │   ├── use-auto-tab-switch.ts
│       │   │   ├── use-code-generation.ts
│       │   │   ├── use-local-storage.ts
│       │   │   ├── use-optimize-page.ts
│       │   │   ├── use-svg-pan-zoom.ts
│       │   │   └── ...
│       │   ├── lib/             # Utility functions (18 files)
│       │   │   ├── constants.ts        # Centralized constants (262 lines)
│       │   │   ├── svgo-config.ts      # SVGO configuration
│       │   │   ├── svg-to-code.ts      # Code generators
│       │   │   ├── svg-transform.ts    # SVG transformations
│       │   │   ├── data-uri-utils.ts   # Data URI conversions
│       │   │   ├── file-utils.ts       # File operations
│       │   │   ├── blog.ts             # Blog utilities
│       │   │   ├── seo.ts              # SEO metadata
│       │   │   └── worker-utils/       # Worker management
│       │   │       ├── cache.ts        # LRU cache with TTL
│       │   │       ├── worker-manager.ts
│       │   │       ├── svgo-worker-client.ts
│       │   │       ├── prettier-worker-client.ts
│       │   │       └── code-generator-worker-client.ts
│       │   ├── routes/          # File-based routing (TanStack Start)
│       │   │   └── {-$locale}/  # Locale-based routing
│       │   │       ├── index.tsx    # Home page
│       │   │       ├── about.tsx    # About page
│       │   │       ├── optimize.tsx # Optimize page
│       │   │       └── blog/        # Blog routes
│       │   │           ├── index.tsx
│       │   │           └── $slug.tsx
│       │   ├── store/           # Global state (Zustand)
│       │   │   ├── svg-store.ts  # SVG optimization state
│       │   │   └── ui-store.ts   # UI state (tabs, export dimensions)
│       │   └── workers/         # Web Workers (3 workers)
│       │       ├── svgo.worker.ts
│       │       ├── code-generator.worker.ts
│       │       └── prettier.worker.ts
│       ├── public/              # Static assets
│       ├── intlayer.config.ts   # i18n configuration (EN, ZH, KO, DE)
│       └── vite.config.ts       # Vite configuration
├── docs/
│   └── images/                  # Documentation images
├── package.json                 # Root package.json (Bun workspace)
└── README.md                    # This file
```

**Key Directories:**

- `lib/constants.ts`: **262-line centralized constants file** with all magic numbers and configuration values, organized by category (SVG, Data URI, Export, Colors, Time, Code Generation, Diff, Zoom, SEO, Blog)
- `components/optimize/`: Modular optimize page components with separation of concerns
- `hooks/`: 12+ custom hooks for file handling, compression, code generation, pan/zoom, and auto-switching
- `lib/worker-utils/`: Worker management with LRU caching (5-minute TTL, 100-entry limit)
- `store/`: Zustand stores for SVG optimization state and UI state (tabs, export dimensions)

---

## 🔧 Configuration

### Constants Configuration

All magic numbers and configuration values are centralized in `lib/constants.ts` (262 lines):

```typescript
// SVG Related Constants
export const SVG_MIME_TYPE = "image/svg+xml";
export const DEFAULT_VIEWBOX = "0 0 24 24";
export const SVG_DIMENSIONS = "1em";

// Image Export Constants
export const DEFAULT_JPEG_QUALITY = 0.95;
export const EXPORT_SCALE_OPTIONS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 7, 8] as const;

// Cache Configuration
export const CACHE_MAX_AGE_MINUTES = 5;
export const DEFAULT_MAX_SIZE = 100;

// Performance
export const DEBOUNCE_DELAY = 150; // milliseconds
export const COPY_BUTTON_RESET_DELAY = 2000;

// ... 50+ more constants organized by category
```

**Constant Categories:**
- SVG Related (MIME types, dimensions, viewBox)
- Data URI & Encoding (Base64, URL encoding)
- Image Export (PNG, JPEG quality, scale options)
- Color Constants (currentColor, ignored colors)
- File Size & Formatting (bytes divisor, units)
- Time & Duration (cache TTL, debounce delays)
- Code Generation (Prettier config, parser mapping)
- Diff Algorithm (max edits, change ratio)
- Zoom & Pan (min/max zoom, step sizes)
- SVG Transformation (rotation angles, scale divisors)
- SEO & Metadata (base URL, Open Graph)

### SVGO Plugins

Configure SVGO optimization through the UI or modify `lib/svgo-plugins.ts`:

```typescript
export const DEFAULT_PLUGINS: SvgoPluginConfig[] = [
  { name: 'removeDoctype', enabled: true },
  { name: 'removeXMLProcInst', enabled: true },
  { name: 'removeComments', enabled: true },
  // ... 40+ plugins
];
```

### Vite Configuration

Customize build settings in `apps/web/vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Refractor - syntax highlighting (~80KB)
          if (id.includes('refractor')) {
            return 'refractor';
          }
          // Prettier (~200KB)
          if (id.includes('prettier/standalone') || /* ... */) {
            return 'prettier';
          }
          // SVGO (~6KB)
          if (id.includes('svgo')) {
            return 'svgo';
          }
          // UI components
          if (id.includes('@radix-ui')) {
            return 'ui';
          }
        },
      },
    },
  },
});
```

---

## 📝 Usage Examples

### Optimizing an SVG

1. **Upload** or **paste** your SVG code
2. **Configure** SVGO plugins in the sidebar
3. **Preview** the optimized result
4. **Download** or **copy** the optimized SVG

### Generating Framework Code

1. Optimize your SVG first
2. Switch to **code generation tabs** (React JSX/TSX, Vue, etc.)
3. **Prettify** the code if needed
4. **Copy** or **download** the generated code

### Customizing Preview

1. Click the **background button** to cycle through styles
2. Use **zoom controls** to adjust preview size
3. Compare **original vs optimized** in side-by-side view

---

## 🚀 Deployment

### Why Vercel Instead of Cloudflare Workers?

This project was initially built for Cloudflare Workers but has been migrated to Vercel due to runtime limitations with MDX content rendering.

**Technical Reasons:**

1. **MDX Runtime Restrictions**: MDX uses `eval()` and `new Function()` to compile and render content at runtime. Cloudflare Workers have strict security policies that prohibit these JavaScript evaluation methods for security reasons.

2. **SSR Failures**: When blog MDX content is processed during Server-Side Rendering (SSR), Cloudflare Workers throw runtime errors due to the `eval()` restriction. This causes the rendering to fall back to Client-Side Rendering (CSR).

3. **SEO Impact**: The fallback to CSR means:
   - Search engines receive empty or incomplete HTML
   - Blog content is not indexed properly
   - Meta tags and Open Graph data are not available during initial page load
   - Page performance scores decrease due to content shifting

4. **Content Security Policy**: Cloudflare Workers enforce a strict Content Security Policy (CSP) that prevents dynamic code execution, which is essential for MDX compilation.

Vercel's Node.js runtime environment fully supports these features, allowing proper SSR for all MDX content, maintaining SEO benefits and optimal performance.

---

### Vercel (Recommended)

This project is configured for Vercel deployment with full SSR support.

#### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): `npm i -g vercel`

#### Quick Deploy

The easiest way to deploy is to connect your GitHub repository to Vercel:

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel will auto-detect the settings and deploy

#### Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Or use the bun script
cd apps/web
bun run deploy
```

#### Environment Variables

Set environment variables in your Vercel project settings or via CLI:

```bash
# Set a variable
vercel env add VARIABLE_NAME

# Pull environment variables for local development
vercel env pull
```

#### Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Vercel will automatically configure DNS

#### Deployment Best Practices

- **Build locally first**: Run `bun --filter web build` to catch errors before deploying
- **Test with preview**: Use `bun --filter web serve` to test the production build locally
- **Check bundle size**: Monitor `apps/web/.output/public/assets/` to ensure bundles are optimized
- **Preview deployments**: Every push to a branch creates a preview deployment

### Other Platforms

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Docker

```bash
# Build Docker image
docker build -t tiny-svg .

# Run container
docker run -p 3001:3001 tiny-svg
```

### Build Output

After running `bun run build`, the output structure is:

```
apps/web/.output/
├── public/              # Static assets (served by Vercel)
│   ├── assets/         # JS/CSS bundles
│   │   ├── index-*.js   # Main bundle (~15.79 KB)
│   │   ├── refractor-*.js # Refractor syntax highlighting (~80 KB)
│   │   ├── prettier-*.js # Prettier (~200 KB)
│   │   ├── svgo-*.js    # SVGO (~6 KB)
│   │   └── ui-*.js      # UI components
│   └── ...
└── server/              # SSR server code
    └── index.mjs        # Server entry point
```

**Bundle Optimization**:
- Main route: 15.79 KB (97.4% reduction from 611.74 KB)
- Code splitting: Refractor, Prettier, SVGO, and UI in separate chunks
- Lazy loading: Components load on-demand
- Lightweight syntax highlighting: Refractor replaces Monaco Editor (~200KB saved)
- Web Workers: CPU-intensive tasks run in separate threads

---

## 🗺️ Roadmap & TODO

### ✅ Completed Features

- [x] **Upload header block** - Re-upload functionality after initial upload
- [x] **Data URI tab** - Three formats: minified, base64, and URL-encoded with size comparison
- [x] **SVG pan and zoom** - Interactive controls (20%-400% zoom, click-and-drag pan)
- [x] **SVG transformations** - Rotate (90°), flip (horizontal/vertical), resize (proportional)
- [x] **Lightweight syntax highlighting** - Replaced Monaco Editor with Refractor (~200KB reduction)
- [x] **Diff viewer** - shadcn/ui-based diff comparison with unified diff format
- [x] **Export dimensions** - Customizable PNG/JPEG export with scale presets (0.25x-8x)
- [x] **Constants refactoring** - Centralized 262-line constants file with comprehensive documentation
- [x] **Auto tab switching** - Automatically switches to "optimized" tab after compression
- [x] **Blog system** - MDX-based blog with Content Collections integration

### 🚧 In Progress

- [ ] **PWA support** - Progressive Web App capabilities for offline usage

### 📋 Planned Features

- [ ] **SVG share** - Generate shareable links with expiration (requires server storage)
- [ ] **SVG history** - Track previously optimized SVGs in LocalStorage with restore functionality
- [ ] **Interactive plugin demos** - Hover over SVGO plugin settings to see visual examples
- [ ] **SVG collection** - Save favorite SVGs to a personal collection (requires authentication & server storage)
- [ ] **AI-powered search** - AI recognizes SVG content and provides descriptive keywords for intelligent search
- [ ] **SVG sprite generator** - Combine multiple SVGs into sprite sheets
- [ ] **Accessibility checker** - Analyze and suggest improvements for SVG accessibility
- [ ] **Animation support** - Preserve and optimize SVG animations (SMIL, CSS)

### 💡 Ideas Under Consideration

- Advanced optimization presets (web, print, icons)
- SVG to other formats (PDF, EPS, PNG sequence)
- Collaborative optimization sessions
- Plugin marketplace for custom SVGO plugins
- VS Code extension integration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Follow **Biome** linting rules
- Write **TypeScript** with strict mode
- Use **conventional commits** format
- Add **tests** for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[SVGO](https://github.com/svg/svgo)** - The powerful SVG optimizer
- **[TanStack](https://tanstack.com/)** - Amazing React ecosystem
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Better T Stack](https://better-t-stack.dev/)** - Better Start Template
- **All contributors** who have helped improve this project

## Code Template

- start with same template [tiny-svg start template](https://better-t-stack.dev/stack?name=my-better-t-app&fe-w=tanstack-start&fe-n=none&rt=none&be=none&api=none&db=none&orm=none&dbs=none&au=none&pay=none&pm=bun&add=biome%2Cultracite&ex=&git=true&i=true&wd=none&sd=vercel&yolo=false)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/hehehai/tiny-svg/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hehehai/tiny-svg/discussions)

---

<div align="center">

Made with ❤️ by developers, for developers

**[⬆ Back to Top](#tiny-svg)**

</div>
