import { copyToClipboard, downloadBlob } from "@tiny-svg/utils";
import { useCallback, useMemo } from "react";
import {
  type CodeFormat,
  generateCodeFromSvg,
  sanitizeComponentName,
} from "@/ui/lib/format-converters";
import { useActionHandler } from "../use-action-handler";

/**
 * Hook for code generation actions
 */
export function useCodeActions(svg: string, filename: string) {
  const componentName = useMemo(
    () => sanitizeComponentName(filename),
    [filename]
  );

  const onDownload = useCallback(
    async (format: CodeFormat) => {
      const { code, filename: generatedFilename } = generateCodeFromSvg(
        svg,
        format,
        componentName
      );
      const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
      downloadBlob(blob, generatedFilename);
    },
    [svg, componentName]
  );

  const onCopy = useCallback(
    async (format: CodeFormat) => {
      const { code } = generateCodeFromSvg(svg, format, componentName);
      await copyToClipboard(code);
    },
    [svg, componentName]
  );

  const actionHandler = useActionHandler<CodeFormat>({
    onDownload,
    onCopy,
    getSuccessMessage: (action) =>
      action === "download" ? "Code downloaded" : "Code copied to clipboard",
    getErrorMessage: (action) =>
      action === "download" ? "Failed to download code" : "Failed to copy code",
  });

  return actionHandler;
}
