import type { Config as SvgoConfig } from "svgo";

export interface SvgState {
  originalSvg: string;
  compressedSvg: string;
  fileName: string;
  svgoConfig: SvgoConfig;
  compressionRatio?: number;
  originalSize?: number;
  compressedSize?: number;
}

export interface SvgProcessingOptions {
  includeMetadata?: boolean;
  preserveAspectRatio?: boolean;
  optimizeColors?: boolean;
}

export interface CompressionResult {
  success: boolean;
  svg?: string;
  error?: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export interface SvgBatchItem extends SvgState {
  id: string;
  layerName: string;
  nodeId: string;
}

export interface SvgBatchResult {
  items: SvgBatchItem[];
  totalOriginalSize: number;
  totalCompressedSize: number;
  averageCompressionRatio: number;
}
