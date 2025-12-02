import { copyToClipboard, downloadSvg } from "@tiny-svg/utils";
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Hook for SVG item actions (copy, download)
 */
export function useSvgActions(svg: string, filename: string) {
  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(svg);
      toast.success("SVG copied to clipboard");
    } catch (error) {
      console.error("Failed to copy SVG:", error);
      toast.error("Failed to copy SVG");
    }
  }, [svg]);

  const handleDownload = useCallback(() => {
    try {
      downloadSvg(svg, `${filename}.svg`);
      toast.success("SVG downloaded");
    } catch (error) {
      console.error("Failed to download SVG:", error);
      toast.error("Failed to download SVG");
    }
  }, [svg, filename]);

  return {
    handleCopy,
    handleDownload,
  };
}
