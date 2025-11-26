// Type exports
export type {
  CompressionResult,
  SvgBatchItem,
  SvgBatchResult,
  SvgProcessingOptions,
  SvgState,
} from "./types.js";

// Utility exports
export {
  calculateCompressionRatio,
  calculateSize,
  createSvgState,
  formatSize,
  updateCompressionResult,
  validateSvg,
} from "./utils.js";
