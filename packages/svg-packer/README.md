# @tiny-svg/svg-packer

Convert SVG icons to icon fonts (SVG, TTF, EOT, WOFF, WOFF2) in the browser or Node.js.

## Features

- 🚀 **Browser & Node.js** - Works in both environments
- 📦 **Multiple Formats** - Generate SVG, TTF, EOT, WOFF, WOFF2 fonts
- 🎨 **CSS Generation** - Auto-generate CSS with font-face rules
- 🔧 **TypeScript** - Full TypeScript support
- ⚡ **Dual Mode** - WASM (with WOFF2) and non-WASM modes
- 📝 **HTML Demo** - Generate demo HTML file

## Installation

```bash
npm install @tiny-svg/svg-packer
# or
pnpm add @tiny-svg/svg-packer
# or
yarn add @tiny-svg/svg-packer
```

## Usage

### Basic Example (Node.js)

```typescript
import { SvgPacker } from '@tiny-svg/svg-packer';
import fs from 'fs/promises';

const result = await SvgPacker({
  fontName: 'my-icons',
  icons: [
    {
      name: 'home',
      svg: '<svg>...</svg>',
    },
    {
      name: 'user',
      svg: '<svg>...</svg>',
    },
  ],
});

// Save generated fonts
await fs.writeFile('icons.ttf', Buffer.from(await result.files.ttf.blob.arrayBuffer()));
await fs.writeFile('icons.woff', Buffer.from(await result.files.woff.blob.arrayBuffer()));
await fs.writeFile('icons.woff2', Buffer.from(await result.files.woff2.blob.arrayBuffer()));
await fs.writeFile('icons.css', await result.files.css.blob.text());

// Save ZIP file with all fonts
await fs.writeFile('icons.zip', Buffer.from(await result.zip.blob.arrayBuffer()));
```

### Browser Example

```typescript
import { SvgPacker } from '@tiny-svg/svg-packer';

const result = await SvgPacker({
  fontName: 'my-icons',
  icons: [
    {
      name: 'home',
      svg: '<svg>...</svg>',
    },
  ],
});

// Download individual font files
const link = document.createElement('a');
link.href = result.files.woff2.url!;
link.download = result.files.woff2.name;
link.click();

// Or download ZIP with all fonts
const zipLink = document.createElement('a');
zipLink.href = result.zip.url!;
zipLink.download = result.zip.name;
zipLink.click();
```

### Disable WOFF2 (Non-WASM Mode)

WOFF2 generation requires WebAssembly. If you don't need WOFF2 or want to avoid WASM, disable it:

```typescript
const result = await SvgPacker({
  fontName: 'my-icons',
  enableWOFF2: false, // Disable WASM-based WOFF2 generation
  icons: [
    {
      name: 'home',
      svg: '<svg>...</svg>',
    },
  ],
});

// result.files will not include woff2
// CSS will not reference woff2 format
```

## API

### `SvgPacker(options: SvgPackerOptions): Promise<SvgPackerResult>`

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fontName` | `string` | `'iconfont'` | Font family name |
| `cssPrefix` | `string` | `'iconfont'` | CSS class prefix |
| `fileName` | `string` | `'iconfont'` | Output file name |
| `startCodepoint` | `number` | `0xE001` | Starting Unicode codepoint |
| `fontHeight` | `number` | `1000` | Font height |
| `descent` | `number` | `0` | Font descent |
| `fixedWidth` | `boolean` | `false` | Fixed width font |
| `enableWOFF2` | `boolean` | `true` | Enable WOFF2 generation (requires WASM) |
| `icons` | `Icon[]` | *required* | Array of SVG icons |

#### Icon Interface

```typescript
interface Icon {
  name: string;      // Icon name (used in CSS class)
  svg: string;       // SVG content
  unicode?: number;  // Custom Unicode codepoint (optional)
}
```

#### Result

```typescript
interface SvgPackerResult {
  files: {
    svg: { name: string; blob: Blob; url?: string };
    ttf: { name: string; blob: Blob; url?: string };
    eot: { name: string; blob: Blob; url?: string };
    woff: { name: string; blob: Blob; url?: string };
    woff2?: { name: string; blob: Blob; url?: string }; // Only if enableWOFF2 is true
    css: { name: string; blob: Blob; url?: string };
    html: { name: string; blob: Blob; url?: string };
  };
  zip: {
    name: string;
    blob: Blob;
    url?: string;
  };
}
```

## Generated CSS

The generated CSS includes `@font-face` rules and icon classes:

```css
@font-face {
  font-family: "my-icons";
  src: url("./my-icons.eot") format("embedded-opentype"),
       url("./my-icons.ttf") format("truetype"),
       url("./my-icons.woff") format("woff"),
       url("./my-icons.woff2") format("woff2"),
       url("./my-icons.svg") format("svg");
  font-weight: normal;
  font-style: normal;
}

.my-icons {
  font-family: "my-icons" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.my-icons.home:before {
  content: "\\e001";
}

.my-icons.user:before {
  content: "\\e002";
}
```

## Generated HTML Demo

A demo HTML file is automatically generated showing all icons:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="my-icons.css">
</head>
<body>
  <h1>My Icons Preview</h1>
  <ul>
    <li><i class="my-icons home"></i> home</li>
    <li><i class="my-icons user"></i> user</li>
  </ul>
</body>
</html>
```

## Browser Support

- Modern browsers with ES2020 support
- WebAssembly support required for WOFF2 generation
- Use `enableWOFF2: false` for older browsers without WASM

## Node.js Support

- Node.js 16+ required
- Full support for all font formats including WOFF2

## Examples

See the `test/` directory for complete examples:
- [Node.js Example](./test/node.test.ts)
- [Browser Example](./test/browser.test.ts)

## License

MIT

## Credits

Built with:
- [svgicons2svgfont](https://github.com/nfroidure/svgicons2svgfont)
- [svg2ttf](https://github.com/fontello/svg2ttf)
- [ttf2woff](https://github.com/fontello/ttf2woff)
- [ttf2woff2](https://github.com/nfroidure/ttf2woff2)
- [ttf2eot](https://github.com/fontello/ttf2eot)
