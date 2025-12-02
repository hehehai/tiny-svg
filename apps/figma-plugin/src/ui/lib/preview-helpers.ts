import { copyToClipboard } from "@tiny-svg/utils";
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Format code using Prettier
 */
export async function prettifyCode(code: string): Promise<string> {
  try {
    const [prettier, parserHtml] = await Promise.all([
      import("prettier/standalone"),
      import("prettier/plugins/html"),
    ]);

    const formatted = await prettier.format(code, {
      parser: "html",
      plugins: [parserHtml],
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
    });

    return formatted;
  } catch (error) {
    console.error("Prettify error:", error);
    throw error;
  }
}

/**
 * Format compression ratio as percentage string
 */
export function formatCompressionRatio(ratio: number | undefined): string {
  if (!ratio) {
    return "";
  }
  return `-${Math.round(ratio * 100)}%`;
}

/**
 * Hook for copy to clipboard with toast notification
 */
export function useCopyToClipboard() {
  return useCallback((text: string, successMessage = "Copied to clipboard") => {
    try {
      copyToClipboard(text);
      toast.success(successMessage);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy");
    }
  }, []);
}
