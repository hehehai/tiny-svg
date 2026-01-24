import type { ReactNode } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { extractSvgFromDataUri, isSvgContent } from "@/lib/file-utils";

interface UsePasteHandlerOptions {
  setOriginalSvg: (svg: string, name: string) => void;
  setHasAutoSwitchedTab?: (value: boolean) => void;
  onSuccess?: () => void;
  errorMessage?: ReactNode;
}

export function usePasteHandler({
  setOriginalSvg,
  setHasAutoSwitchedTab,
  onSuccess,
  errorMessage = "Invalid SVG content. Please paste valid SVG code.",
}: UsePasteHandlerOptions) {
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) {
        return;
      }

      for (const item of items) {
        if (item.type === "text/plain") {
          item.getAsString((text) => {
            if (isSvgContent(text)) {
              setOriginalSvg(text, "pasted.svg");
              setHasAutoSwitchedTab?.(false);
              toast.success("SVG pasted successfully!");
              onSuccess?.();
            } else {
              const extracted = extractSvgFromDataUri(text);
              if (extracted) {
                setOriginalSvg(extracted, "pasted.svg");
                setHasAutoSwitchedTab?.(false);
                toast.success("SVG pasted successfully!");
                onSuccess?.();
              } else {
                toast.error(errorMessage);
              }
            }
          });
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [setOriginalSvg, setHasAutoSwitchedTab, onSuccess, errorMessage]);
}
