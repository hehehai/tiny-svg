import { useCallback } from "react";
import { useCopyToClipboard } from "@/ui/lib/preview-helpers";

interface UseDiffViewerReturn {
  handleCopy: () => void;
}

/**
 * Hook for diff viewer logic
 */
export function useDiffViewer(modifiedCode: string): UseDiffViewerReturn {
  const copyToClipboard = useCopyToClipboard();

  const handleCopy = useCallback(() => {
    copyToClipboard(modifiedCode, "Optimized code copied to clipboard");
  }, [modifiedCode, copyToClipboard]);

  return {
    handleCopy,
  };
}
