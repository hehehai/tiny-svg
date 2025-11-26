# Tiny SVG - Figma Plugin

A Figma plugin for optimizing SVG assets with real-time compression and code export capabilities.

## Features

- 🎨 **Batch SVG Optimization**: Select and optimize multiple SVG layers at once
- ⚡ **Real-time Preview**: See compression results instantly
- 🎯 **Compression Presets**: Choose from optimized presets (Default, Aggressive, Minimal, etc.)
- 💻 **Code Export**: Generate React, Vue, Svelte, React Native, Flutter code
- 🔗 **Data URI Support**: Convert SVGs to data URLs
- 📊 **Compression Statistics**: View size savings and compression ratios
- 🔄 **In-place Replacement**: Replace SVGs directly in Figma

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
2. Go to Plugins → Development → Import plugin from manifest...
3. Select the `manifest.json` file from the plugin directory
4. The plugin will appear in your plugins list as "Tiny SVG - SVG Optimizer"

### Usage

1. Select one or more SVG layers in your Figma file
2. Open the Tiny SVG plugin
3. Choose a compression preset
4. Click "Compress SVGs" to optimize
5. Preview the results and export code or replace in-place

## Architecture

### Shared Packages

- **@tiny-svg/svg-core**: Core SVG processing utilities and types
- **@tiny-svg/svgo-plugins**: SVGO plugin configurations and presets
- **@tiny-svg/code-generators**: Multi-framework code generation

### Plugin Structure

```
apps/figma-plugin/
├── src/
│   ├── plugin.ts          # Main Figma plugin code
│   └── ui/                # React UI application
│       ├── index.tsx      # Entry point
│       ├── components/    # React components
│       ├── hooks/         # Custom hooks
│       ├── store/         # State management
│       └── styles.css     # Figma-styled CSS
├── manifest.json          # Figma plugin manifest
├── webpack.config.js      # Build configuration
└── dist/                  # Built plugin files
```

## Debugging

### UI Debugging

The UI runs in a regular browser context. Use Chrome DevTools to debug:

1. Right-click in the plugin UI
2. Select "Inspect"
3. Use the DevTools console and debugger

### Plugin Debugging

Use Figma's console:

1. Open Figma
2. Go to Plugins → Development → Open Console
3. View plugin logs and errors

### Common Issues

- **"Cannot find module"**: Ensure you've built the shared packages with `pnpm build:packages`
- **"Plugin not loading"**: Check the manifest.json for correct file paths
- **"Messages not working"**: Verify the message passing between plugin.ts and UI

## Contributing

When making changes to shared packages, remember to:

1. Build the packages: `pnpm build:packages`
2. Rebuild the plugin: `pnpm build:figma`
3. Reload the plugin in Figma

## License

MIT License - see LICENSE file for details.
