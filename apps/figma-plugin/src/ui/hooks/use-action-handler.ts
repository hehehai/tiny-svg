import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseActionHandlerOptions<T> {
  onDownload: (format: T) => Promise<void>;
  onCopy: (format: T) => Promise<void>;
  getSuccessMessage?: (action: "download" | "copy", format: T) => string;
  getErrorMessage?: (action: "download" | "copy", format: T) => string;
}

interface UseActionHandlerReturn<T> {
  loadingFormat: string | null;
  isLoading: (format: T, action: "download" | "copy") => boolean;
  handleDownload: (format: T) => Promise<void>;
  handleCopy: (format: T) => Promise<void>;
}

/**
 * Shared hook for handling download and copy actions with loading states
 */
export function useActionHandler<T extends string>({
  onDownload,
  onCopy,
  getSuccessMessage,
  getErrorMessage,
}: UseActionHandlerOptions<T>): UseActionHandlerReturn<T> {
  const [loadingFormat, setLoadingFormat] = useState<string | null>(null);

  const isLoading = useCallback(
    (format: T, action: "download" | "copy") =>
      loadingFormat === `${format}-${action}`,
    [loadingFormat]
  );

  const handleDownload = useCallback(
    async (format: T) => {
      try {
        setLoadingFormat(`${format}-download`);
        await onDownload(format);

        const message = getSuccessMessage
          ? getSuccessMessage("download", format)
          : "Downloaded successfully";
        toast.success(message);
      } catch (error) {
        console.error(`Failed to download ${format}:`, error);

        const message = getErrorMessage
          ? getErrorMessage("download", format)
          : "Failed to download";
        toast.error(message);
      } finally {
        setLoadingFormat(null);
      }
    },
    [onDownload, getSuccessMessage, getErrorMessage]
  );

  const handleCopy = useCallback(
    async (format: T) => {
      try {
        setLoadingFormat(`${format}-copy`);
        await onCopy(format);

        const message = getSuccessMessage
          ? getSuccessMessage("copy", format)
          : "Copied to clipboard";
        toast.success(message);
      } catch (error) {
        console.error(`Failed to copy ${format}:`, error);

        const message = getErrorMessage
          ? getErrorMessage("copy", format)
          : "Failed to copy";
        toast.error(message);
      } finally {
        setLoadingFormat(null);
      }
    },
    [onCopy, getSuccessMessage, getErrorMessage]
  );

  return {
    loadingFormat,
    isLoading,
    handleDownload,
    handleCopy,
  };
}
