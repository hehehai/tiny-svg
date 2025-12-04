# Tiny SVG - Figma Plugin

[![Install Plugin](https://img.shields.io/badge/Figma-Install_Plugin-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/community/plugin/1577284420062305768)

A Figma plugin for optimizing SVG assets with real-time compression and code export capabilities.

**[→ Install from Figma Community](https://www.figma.com/community/plugin/1577284420062305768)**

## Features

- 🎨 **Batch SVG Optimization**: Select and optimize multiple SVG layers at once
- ⚡ **Real-time Preview**: See compression results instantly with side-by-side diff viewer
- 🎯 **Compression Presets**: Choose from optimized presets (Default, Aggressive, Minimal, Custom)
- 💻 **Code Export**: Generate framework-specific code (React, Vue, Svelte, React Native, Flutter)
- 🔗 **Data URI Support**: Convert SVGs to data URLs for inline usage
- 📊 **Compression Statistics**: View detailed size savings and compression ratios
- 🔄 **In-place Replacement**: Replace SVGs directly in your Figma design
- 🎭 **SVG Transformations**: Rotate, flip, and resize SVGs with visual preview
- 🌓 **Syntax Highlighting**: Beautiful code preview with theme support

## Development

### Prerequisites

- Node.js 18+
- pnpm
- Figma Desktop App (for development)

### Setup

```bash
# Install dependencies
pnpm install

# Build shared packages
pnpm build:packages

# Start development
pnpm dev:figma
```

### Building for Production

```bash
# Build the plugin
pnpm build:figma
```

The built plugin will be in the `dist/` directory.

### Installing in Figma

1. Open Figma Desktop App
2. Go to **Plugins → Development → Import plugin from manifest...**
3. Select the `manifest.json` file from the plugin directory (`apps/figma-plugin/manifest.json`)
4. The plugin will appear in your plugins list as **"Tiny SVG - SVG Optimizer"**

### Usage

1. **Select SVG layers**: Click on one or more SVG layers in your Figma file
2. **Open plugin**: Go to **Plugins → Development → Tiny SVG - SVG Optimizer**
3. **Choose preset**: Select a compression preset from the dropdown (Default, Aggressive, Minimal, or Custom)
4. **Optimize**: Click "Optimize SVGs" to process your selection
5. **Review results**: 
   - View compression statistics (original size, optimized size, savings)
   - Preview the optimized SVG with side-by-side diff viewer
   - Apply transformations (rotate, flip, resize) if needed
6. **Export or replace**:
   - Copy the optimized SVG code
   - Generate framework-specific code (React, Vue, Svelte, etc.)
   - Convert to Data URI for inline usage
   - Replace the original in Figma with "Replace in Figma" button

## Plugin Configuration

### Icon

The plugin uses the Tiny SVG logo as its icon. According to Figma's plugin guidelines, icon files should be placed in the plugin root directory:

**Icon Files:**
- `icon.svg` - Vector icon (40x40) in plugin root
- `icon.png` - Raster fallback (128x128) in plugin root
- `assets/icon.svg` - Source icon
- `assets/icon.png` - Source icon

**How Icons Work:**
- During development, icons won't show in the Figma plugins menu
- When published to Figma Community, Figma automatically uses `icon.svg` or `icon.png` from the plugin root
- Icons are also copied to `dist/` directory during build for future use

**Icon Requirements:**
- SVG: Single color, no gradients, 40x40 viewBox
- PNG: 128x128 pixels, transparent background

## Architecture

### Shared Packages

- **@tiny-svg/svg-core**: Core SVG processing utilities and types
- **@tiny-svg/svgo-plugins**: SVGO plugin configurations and presets
- **@tiny-svg/code-generators**: Multi-framework code generation

### Plugin Structure

```
apps/figma-plugin/
├── assets/                # Plugin assets
│   ├── icon.svg              # Vector icon (40x40)
│   └── icon.png              # Raster icon (128x128)
├── src/
│   ├── plugin.ts          # Main Figma plugin code (runs in sandbox)
│   └── ui/                # React UI application
│       ├── index.tsx      # Entry point
│       ├── components/    # React components
│       │   ├── svg-list.tsx          # SVG item list
│       │   ├── svg-item.tsx          # Individual SVG item card
│       │   ├── preset-selector.tsx   # Compression preset dropdown
│       │   ├── svg-preview-drawer.tsx # Optimized SVG preview with diff viewer
│       │   ├── code-generator-dialog.tsx # Framework code generation
│       │   └── ...
│       ├── hooks/         # Custom React hooks
│       │   ├── use-svg-optimization.ts  # SVG optimization logic
│       │   └── use-figma-selection.ts   # Figma selection handling
│       ├── store/         # Zustand state management
│       │   └── plugin-store.ts          # Plugin state (SVGs, settings, UI)
│       └── styles.css     # Figma-styled CSS
├── manifest.json          # Figma plugin manifest
├── vite.config.ts         # Build configuration (includes icon copying)
└── dist/                  # Built plugin files (generated)
    ├── index.html            # UI bundle (inlined)
    ├── plugin.js             # Plugin sandbox code
    ├── icon.svg              # Plugin icon (copied from assets)
    └── icon.png              # Plugin icon (copied from assets)
```

## Debugging

### UI Debugging

The UI runs in a regular browser context within Figma. Use Chrome DevTools:

1. Right-click anywhere in the plugin UI
2. Select **"Inspect"** or **"Inspect Element"**
3. Use DevTools Console, Network, and Debugger tabs as normal

### Plugin Sandbox Debugging

The plugin sandbox code (`plugin.ts`) runs in a separate context. Use Figma's Console:

1. Open Figma Desktop App
2. Go to **Plugins → Development → Open Console**
3. View `console.log()` output, errors, and warnings from `plugin.ts`

### Hot Reload

When running `pnpm dev:figma`:
- UI changes reload automatically
- Plugin sandbox changes require manual reload in Figma (**Plugins → Development → Reload plugin**)

### Common Issues

| Issue | Solution |
|-------|----------|
| **"Cannot find module"** | Run `pnpm build:packages` to build shared packages (`@tiny-svg/svg-core`, `@tiny-svg/svgo-plugins`, `@tiny-svg/code-generators`) |
| **"Plugin not loading"** | Verify `manifest.json` paths are correct. Ensure `dist/` directory exists with `plugin.js` and `index.html` |
| **"Messages not working"** | Check message passing between `plugin.ts` (sandbox) and UI. Use `figma.ui.postMessage()` and `window.onmessage` |
| **"Icons not showing"** | Run `pnpm build` to copy icons from `assets/` to `dist/`. Verify `manifest.json` references `dist/icon.svg` |
| **Styles not matching Figma** | The plugin uses Figma's design tokens. Check `styles.css` for proper color and spacing variables |

## Contributing

When making changes:

1. **Shared packages**: If modifying `@tiny-svg/svg-core`, `@tiny-svg/svgo-plugins`, or `@tiny-svg/code-generators`:
   ```bash
   pnpm build:packages  # Rebuild shared packages
   pnpm build:figma     # Rebuild plugin
   ```

2. **Plugin code**: After changes to `src/plugin.ts` or `src/ui/`:
   ```bash
   pnpm build:figma     # Build for production
   # OR
   pnpm dev:figma       # Development mode with hot reload
   ```

3. **Testing in Figma**: After building, reload the plugin in Figma:
   - **Plugins → Development → Reload plugin** (or use keyboard shortcut)

4. **Icons**: If changing icons in `assets/`, they'll be automatically copied during build

## Publishing to Figma Community

To publish the plugin to Figma Community:

1. **Build for production**:
   ```bash
   pnpm build:figma
   ```

2. **Test thoroughly**: Ensure the plugin works correctly in Figma Desktop

3. **Update manifest**: In `manifest.json`, set a unique `id` (already set to `tiny-svg-optimizer`)

4. **Publish**:
   - In Figma Desktop, go to **Plugins → Development → Publish plugin**
   - Fill in plugin details, screenshots, and description
   - Submit for review

5. **Community Guidelines**: Follow [Figma's Plugin Guidelines](https://help.figma.com/hc/en-us/articles/360042786373-Publish-plugins-to-the-Figma-Community)

## Technology Stack

- **Framework**: React 19 with React Compiler
- **Build Tool**: Vite 5
- **Bundling**: `vite-plugin-singlefile` (inlines all assets into single HTML)
- **Styling**: Tailwind CSS 4 with Figma design tokens
- **UI Components**: Radix UI primitives
- **State Management**: Zustand
- **SVG Optimization**: SVGO (via shared `@tiny-svg/svgo-plugins`)
- **Code Generation**: Multi-framework support (via shared `@tiny-svg/code-generators`)
- **Syntax Highlighting**: Shiki (lazy-loaded)
- **Diff Viewer**: Custom implementation with line-by-line comparison

## License

MIT License - see LICENSE file for details.
