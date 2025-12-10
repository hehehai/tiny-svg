// Default configuration values
export const DEFAULT_FONT_NAME = "iconfont";
export const DEFAULT_CSS_PREFIX = "iconfont";
export const DEFAULT_FILE_NAME = "iconfont";
export const DEFAULT_START_CODEPOINT = 0xe0_01;
export const DEFAULT_FONT_HEIGHT = 1000;
export const DEFAULT_DESCENT = 0;
export const DEFAULT_FIXED_WIDTH = false;
export const DEFAULT_ENABLE_WOFF2 = true;

// MIME types
export const MIME_TYPES = {
  svg: "image/svg+xml",
  ttf: "application/octet-stream",
  eot: "application/octet-stream",
  woff: "application/octet-stream",
  woff2: "application/octet-stream",
  css: "text/css",
  html: "text/html",
} as const;
