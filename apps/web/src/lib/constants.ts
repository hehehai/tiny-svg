/**
 * Core constants used across the application
 * Centralized constant definitions to avoid magic numbers and improve maintainability
 */

// ============================================================================
// SVG Related Constants
// ============================================================================

/** SVG MIME type for file operations */
export const SVG_MIME_TYPE = "image/svg+xml";

/** SVG file extension */
export const SVG_EXTENSION = ".svg";

/** SVG XML namespace URI */
export const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

/** Default viewBox value for SVG icons */
export const DEFAULT_VIEWBOX = "0 0 24 24";

/** Default SVG dimensions (em units for scalable icons) */
export const SVG_DIMENSIONS = "1em";

/** Default component name for code generation */
export const DEFAULT_COMPONENT_NAME = "TinySVGDemo";

/** Default filename for pasted SVG content */
export const PASTED_FILENAME = "pasted.svg";

/** Number of values in a viewBox attribute (x, y, width, height) */
export const VIEWBOX_VALUES_COUNT = 4;

/** Regex pattern to split viewBox values (spaces or commas) */
export const VIEWBOX_SPLIT_PATTERN = /\s+|,/;

/** Default dimension when SVG size cannot be determined */
export const DEFAULT_SVG_DIMENSION = 100;

/** Minimum dimension for exported images (prevents tiny outputs) */
export const MIN_EXPORT_DIMENSION = 512;

/** Default dimension fallback for image export */
export const DEFAULT_DIMENSION = 1024;

// ============================================================================
// Data URI and Encoding Constants
// ============================================================================

/** Base64 data URI prefix for SVG */
export const BASE64_DATA_URI_PREFIX = "data:image/svg+xml;base64,";

/** Data URI prefix for SVG (without encoding) */
export const DATA_URI_PREFIX = "image/svg+xml";

/** Base64 encoding identifier */
export const BASE64_ENCODING = "base64";

/** SVG blob type with UTF-8 charset */
export const SVG_BLOB_TYPE = "image/svg+xml;charset=utf-8";

/** Plain text blob type with UTF-8 charset */
export const TEXT_BLOB_TYPE = "text/plain;charset=utf-8";

/** URL encoding replacements for data URIs */
export const URL_ENCODING_REPLACEMENTS = {
  "%20": " ",
  "%3D": "=",
  "%3A": ":",
  "%2F": "/",
} as const;

// ============================================================================
// Image Export Constants
// ============================================================================

/** PNG MIME type */
export const PNG_MIME_TYPE = "image/png";

/** JPEG MIME type */
export const JPEG_MIME_TYPE = "image/jpeg";

/** WebP MIME type */
export const WEBP_MIME_TYPE = "image/webp";

/** ICO MIME type */
export const ICO_MIME_TYPE = "image/x-icon";

/** PDF MIME type */
export const PDF_MIME_TYPE = "application/pdf";

/** Default JPEG quality (0.0 to 1.0, where 1.0 is highest quality) */
export const DEFAULT_JPEG_QUALITY = 0.95;

/** Default WebP quality (0.0 to 1.0, where 1.0 is highest quality) */
export const DEFAULT_WEBP_QUALITY = 0.9;

/** Default ICO sizes (multiple sizes for better compatibility) */
export const DEFAULT_ICO_SIZES = [16, 32, 48, 64, 128, 256] as const;

/** Default export scale multiplier */
export const DEFAULT_EXPORT_SCALE = 2;

/** Available export scale options for PNG/JPEG export */
export const EXPORT_SCALE_OPTIONS = [
  0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 7, 8,
] as const;

/** Threshold for matching calculated scale to preset options */
export const SCALE_MATCH_THRESHOLD = 0.01;

// ============================================================================
// Color Constants
// ============================================================================

/** Default color value for icon generation (supports theming) */
export const CURRENT_COLOR = "currentColor";

/** Colors to ignore during color replacement (transparent values) */
export const IGNORED_COLORS = ["none", "transparent"] as const;

/** Prefix for URL-based fill/stroke references (gradients, patterns) */
export const URL_COLOR_PREFIX = "url(";

// ============================================================================
// File Size and Formatting Constants
// ============================================================================

/** Bytes divisor for KB/MB conversion (1024 bytes = 1 KB) */
export const BYTES_DIVISOR = 1024;

/** Decimal precision for byte size formatting */
export const BYTE_PRECISION = 2;

/** File size unit labels */
export const SIZE_UNITS = ["B", "KB", "MB"] as const;

/** Multiplier for percentage calculations */
export const PERCENTAGE_MULTIPLIER = 100;

// ============================================================================
// Time and Duration Constants
// ============================================================================

/** Milliseconds per second */
export const MS_PER_SECOND = 1000;

/** Seconds per minute */
export const SECONDS_PER_MINUTE = 60;

/** Cache maximum age in minutes */
export const CACHE_MAX_AGE_MINUTES = 5;

/** Default cache maximum age in milliseconds (5 minutes) */
export const DEFAULT_MAX_AGE_MS = 300_000;

/** Default maximum cache size (number of entries) */
export const DEFAULT_MAX_SIZE = 100;

/** Debounce delay for diff calculations (milliseconds) */
export const DEBOUNCE_DELAY = 150;

/** Copy button reset delay after successful copy (milliseconds) */
export const COPY_BUTTON_RESET_DELAY = 2000;

// ============================================================================
// Code Generation and Formatting Constants
// ============================================================================

/** Prettier tab width for code formatting */
export const PRETTIER_TAB_WIDTH = 2;

/** Prettier print width (max line length) */
export const PRETTIER_PRINT_WIDTH = 80;

/** Prettier trailing comma style */
export const PRETTIER_TRAILING_COMMA = "es5";

/** Language to parser mapping for Prettier */
export const PARSER_MAP = {
  javascript: "babel",
  typescript: "typescript",
  html: "html",
  dart: "",
} as const;

/** File extension mapping for code generation */
export const CODE_LANGUAGE_CONFIG = {
  "react-jsx": { ext: "jsx", language: "javascript" },
  "react-tsx": { ext: "tsx", language: "typescript" },
  vue: { ext: "vue", language: "html" },
  svelte: { ext: "svelte", language: "html" },
  dart: { ext: "dart", language: "dart" },
} as const;

/** Maximum preview length for line keys */
export const LINE_KEY_PREVIEW_LENGTH = 20;

// ============================================================================
// Diff Algorithm Constants
// ============================================================================

/** Marker for unpaired diff lines */
export const UNPAIRED_MARKER = -1;

/** Default maximum number of character edits for inline diff */
export const DEFAULT_MAX_EDITS = 4;

/** Default maximum distance for diff matching */
export const DEFAULT_MAX_DIFF_DISTANCE = 30;

/** Default maximum change ratio for diff comparison */
export const DEFAULT_MAX_CHANGE_RATIO = 0.45;

/** Default inline maximum character edits */
export const DEFAULT_INLINE_MAX_CHAR_EDITS = 2;

// ============================================================================
// Zoom and Pan Constants
// ============================================================================

/** Default zoom level (100%) */
export const DEFAULT_ZOOM = 100;

/** Maximum zoom level (400%) */
export const MAX_ZOOM = 400;

/** Minimum zoom level (20%) */
export const MIN_ZOOM = 20;

/** Zoom step for zoom in/out buttons */
export const ZOOM_STEP = 20;

/** Zoom step for mouse wheel zoom */
export const WHEEL_ZOOM_STEP = 10;

/** Divisor to convert zoom percentage to decimal scale */
export const ZOOM_SCALE_DIVISOR = 100;

/** Grid size for transparent background pattern */
export const GRID_SIZE = "20px";

// ============================================================================
// SVG Transformation Constants
// ============================================================================

/** Rotation angle in degrees (for 90° rotations) */
export const ROTATION_ANGLE = 90;

/** Scale divisor for flip operations (1/2 = 0.5 scale inversion) */
export const SCALE_DIVISOR = 2;

/** Number of values in viewBox array */
export const VIEWBOX_VALUES_LENGTH = 4;

// ============================================================================
// SEO and Metadata Constants
// ============================================================================

/** Base URL for the application */
export const BASE_URL = "https://tiny-svg.actnow.dev";

/** Open Graph image URL */
export const OG_IMAGE_URL = `${BASE_URL}/og-image.png`;

/** Twitter/X handle for the application */
export const TWITTER_HANDLE = "@hehehai";

/** Logo path for structured data */
export const LOGO_PATH = `${BASE_URL}/logo.png`;

// ============================================================================
// Blog Constants
// ============================================================================

/** Default number of blog posts to show on homepage */
export const DEFAULT_BLOG_POSTS_LIMIT = 4;
