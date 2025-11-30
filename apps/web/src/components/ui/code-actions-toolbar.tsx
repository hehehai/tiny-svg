import { Button } from "@tiny-svg/ui/components/button";
import { toast } from "sonner";
import { copyToClipboard, downloadFile } from "@/lib/file-utils";
import type { SupportedLanguage } from "@/lib/worker-utils/prettier-worker-client";
import { prettierWorkerClient } from "@/lib/worker-utils/prettier-worker-client";

type CodeActionsToolbarProps = {
  code: string;
  fileName: string;
  language?: SupportedLanguage;
  onCodeChange?: (code: string) => void;
  showPrettify?: boolean;
  showCopy?: boolean;
  showDownload?: boolean;
  isPrettified?: boolean;
  onPrettifyStateChange?: (isPrettified: boolean) => void;
};

export function CodeActionsToolbar({
  code,
  fileName,
  language,
  onCodeChange,
  showPrettify = true,
  showCopy = true,
  showDownload = true,
  isPrettified = false,
  onPrettifyStateChange,
}: CodeActionsToolbarProps) {
  const handlePrettify = async () => {
    if (!language) {
      toast.error("No language specified for formatting");
      return;
    }

    try {
      const prettified = await prettierWorkerClient.format(code, language);
      onCodeChange?.(prettified);
      onPrettifyStateChange?.(true);
      toast.success("Code formatted successfully!");
    } catch {
      toast.error("Failed to format code");
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(code);
      toast.success("Code copied to clipboard!");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleDownload = () => {
    try {
      downloadFile(code, fileName);
      toast.success(`Downloaded ${fileName}`);
    } catch {
      toast.error("Failed to download file");
    }
  };

  return (
    <div className="flex gap-2">
      {showPrettify && language && (
        <Button
          disabled={isPrettified}
          onClick={handlePrettify}
          size="sm"
          type="button"
          variant="outline"
        >
          <span className="i-hugeicons-magic-wand-01 mr-2 size-4" />
          Prettify
        </Button>
      )}
      {showCopy && (
        <Button onClick={handleCopy} size="sm" type="button" variant="outline">
          <span className="i-hugeicons-copy-01 mr-2 size-4" />
          Copy
        </Button>
      )}
      {showDownload && (
        <Button
          onClick={handleDownload}
          size="sm"
          type="button"
          variant="outline"
        >
          <span className="i-hugeicons-download-01 mr-2 size-4" />
          Download
        </Button>
      )}
    </div>
  );
}
