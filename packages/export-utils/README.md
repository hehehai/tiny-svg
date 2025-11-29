# @tiny-svg/export-utils

Shared utility package for SVG export functionality, used by both the web app and Figma plugin.

## Purpose

This package contains reusable logic extracted from `apps/web/src/lib/` to avoid code duplication between the web application and the Figma plugin.

## What's Included

### File Utilities (`file-utils.ts`)

**Download & Clipboard:**
- `downloadFile()` - Generic file download
- `downloadBlob()` - Download blob as file
- `downloadSvg()` - Download SVG file
- `copyToClipboard()` - Copy text to clipboard

**SVG Processing:**
- `addXmlnsToSvg()` - Add xmlns attribute to SVG
- `getSvgDimensions()` - Extract width/height from SVG (viewBox or attributes)

**Canvas Operations:**
- `createCanvasFromSvg()` - Convert SVG to Canvas with options (background, centering, size)
- `canvasToBlob()` - Convert canvas to blob with quality control

**Image Export (Single File):**
- `exportAsPng()` - Export SVG as PNG
- `exportAsJpeg()` - Export SVG as JPEG (with quality)
- `exportAsWebp()` - Export SVG as WebP (with quality)
- `exportAsIco()` - Export SVG as ICO (favicon)

**Image Export (Blob for Batch):**
- `svgToPngBlob()` - Convert SVG to PNG blob
- `svgToJpegBlob()` - Convert SVG to JPEG blob
- `svgToWebpBlob()` - Convert SVG to WebP blob
- `svgToIcoBlob()` - Convert SVG to ICO blob

### SVG Utilities (`svg-utils.ts`)

- `generateSvgThumbnail()` - Generate base64 thumbnail from SVG
- `getSvgDimensions()` - Parse SVG dimensions
- `formatTimestamp()` - Format relative timestamps

## Usage

### In Web App

```typescript
import { exportAsPng, downloadSvg } from '@tiny-svg/export-utils'

// Download SVG
await downloadSvg(svgContent, 'icon.svg')

// Export as PNG
await exportAsPng(svgContent, 'icon.png')
```

### In Figma Plugin

```typescript
import { svgToPngBlob, svgToJpegBlob } from '@tiny-svg/export-utils'

// Batch export
const pngBlob = await svgToPngBlob(svgContent)
const jpegBlob = await svgToJpegBlob(svgContent, 0.9)

// Add to ZIP
zip.file('icon.png', pngBlob)
zip.file('icon.jpg', jpegBlob)
```

## Code Reuse Benefits

### Before (Duplicated Code)
```
apps/web/src/lib/file-utils.ts (350+ lines)
apps/figma-plugin/src/ui/utils/image-export.ts (350+ lines - duplicate!)
```

### After (Shared Package)
```
packages/export-utils/src/file-utils.ts (350+ lines - SHARED)
apps/web/src/lib/file-utils.ts (re-exports from @tiny-svg/export-utils)
apps/figma-plugin/src/ui/utils/image-export.ts (re-exports from @tiny-svg/export-utils)
```

**Savings:**
- ✅ ~350 lines of duplicated code eliminated
- ✅ Single source of truth for export logic
- ✅ Bug fixes benefit both web and plugin
- ✅ Easier to maintain and test

## Dependencies

- None (pure DOM/Canvas APIs)
- Requires browser environment (uses `DOMParser`, `Canvas`, `Blob`)

## Build

```bash
pnpm build
```

Output:
- `dist/index.js` - ES module
- `dist/index.cjs` - CommonJS module
- `dist/index.d.ts` - TypeScript definitions
