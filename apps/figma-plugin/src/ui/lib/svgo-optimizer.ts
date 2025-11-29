/**
 * SVGO optimizer for browser environment
 * Uses svgo/browser which is optimized for browser usage
 */

import { optimize } from "svgo/browser";
import { getPresetConfig } from "@/lib/preset-utils";
import type { Preset } from "@/types/messages";
import type { SvgItem } from "@/ui/store";

// Re-export Config type for convenience
export type { Config as SvgoConfig } from "svgo/browser";

export interface OptimizedResult {
  id: string;
  compressedSvg: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export async function optimizeSvgBatch(
  items: SvgItem[],
  presets: Preset[],
  globalPreset: string,
  onProgress?: (current: number, total: number) => void
): Promise<OptimizedResult[]> {
  const results: OptimizedResult[] = [];

  for (const [index, item] of items.entries()) {
    try {
      // Get effective preset (resolve 'inherit')
      const presetId = item.preset === "inherit" ? globalPreset : item.preset;
      let preset = presets.find((p) => p.id === presetId);

      if (!preset) {
        console.warn(`Preset "${presetId}" not found, using default`);
        preset = presets.find((p) => p.id === "default");
        if (!preset) {
          throw new Error("Default preset not found");
        }
      }

      // Get SVGO config from preset
      const config = getPresetConfig(preset);

      // Optimize with SVGO
      const result = optimize(item.originalSvg, config);

      const originalSize = new Blob([item.originalSvg]).size;
      const compressedSize = new Blob([result.data]).size;
      const compressionRatio = (originalSize - compressedSize) / originalSize;

      results.push({
        id: item.id,
        compressedSvg: result.data,
        originalSize,
        compressedSize,
        compressionRatio,
      });

      // Report progress
      onProgress?.(index + 1, items.length);

      // Yield to prevent blocking UI
      if (index < items.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } catch (error) {
      console.error(`Failed to optimize item "${item.name}":`, error);

      // Add failed result
      results.push({
        id: item.id,
        compressedSvg: item.originalSvg, // Use original as fallback
        originalSize: new Blob([item.originalSvg]).size,
        compressedSize: new Blob([item.originalSvg]).size,
        compressionRatio: 0,
      });
    }
  }

  return results;
}

export async function optimizeSingleSvg(
  svg: string,
  preset: Preset
): Promise<string> {
  const config = getPresetConfig(preset);
  const result = optimize(svg, config);
  return result.data;
}
