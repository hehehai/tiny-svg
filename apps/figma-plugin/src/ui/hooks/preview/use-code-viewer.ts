import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { prettifyCode, useCopyToClipboard } from "@/ui/lib/preview-helpers";

interface UseCodeViewerReturn {
  displayCode: string;
  isPrettified: boolean;
  canPrettify: boolean;
  handlePrettify: () => Promise<void>;
  handleCopy: () => void;
}

/**
 * Hook for code viewer logic (prettify, copy)
 */
export function useCodeViewer(
  code: string,
  canPrettify: boolean
): UseCodeViewerReturn {
  const [displayCode, setDisplayCode] = useState(code);
  const [isPrettified, setIsPrettified] = useState(false);
  const copyToClipboard = useCopyToClipboard();

  // Reset when code changes
  useEffect(() => {
    setDisplayCode(code);
    setIsPrettified(false);
  }, [code]);

  const handlePrettify = useCallback(async () => {
    if (!canPrettify || isPrettified) {
      return;
    }

    try {
      const formatted = await prettifyCode(displayCode);
      setDisplayCode(formatted);
      setIsPrettified(true);
      toast.success("Code prettified");
    } catch {
      toast.error("Failed to prettify code");
    }
  }, [canPrettify, isPrettified, displayCode]);

  const handleCopy = useCallback(() => {
    copyToClipboard(displayCode, "Code copied to clipboard");
  }, [displayCode, copyToClipboard]);

  return {
    displayCode,
    isPrettified,
    canPrettify: canPrettify && !isPrettified,
    handlePrettify,
    handleCopy,
  };
}
