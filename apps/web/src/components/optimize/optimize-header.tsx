import { Button } from "@tiny-svg/ui/components/button";
import { Separator } from "@tiny-svg/ui/components/separator";
import { useIntlayer } from "react-intlayer";
import { HistoryButton } from "@/components/history-button";
import { formatBytes } from "@/lib/svgo-config";
import { CompactUploadButton } from "./compact-upload-button";

type OptimizeHeaderProps = {
  fileName: string;
  originalSize: number;
  compressedSize: number;
  compressionRate: number;
  compressedSvg: string;
  historyCount: number;
  onCopy: () => void;
  onDownload: () => void;
  onFileUpload: (file: File) => void;
  onToggleHistoryPanel: () => void;
  isSettingsCollapsed?: boolean;
  onToggleSettings?: () => void;
};

export function OptimizeHeader({
  fileName,
  originalSize,
  compressedSize,
  compressionRate,
  compressedSvg,
  historyCount,
  onCopy,
  onDownload,
  onFileUpload,
  onToggleHistoryPanel,
  isSettingsCollapsed,
  onToggleSettings,
}: OptimizeHeaderProps) {
  const { header } = useIntlayer("optimize");

  return (
    <div className="border-b bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HistoryButton
            className="py-5"
            count={historyCount}
            label={header.history}
            onClick={onToggleHistoryPanel}
          />
          <CompactUploadButton className="py-5" onUpload={onFileUpload} />
          <div className="flex flex-col gap-1.5">
            <h1 className="hidden font-bold text-base leading-4 md:block">
              {header.title}
            </h1>
            <p className="text-muted-foreground text-sm leading-3">
              {fileName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right text-sm">
            <div className="text-muted-foreground">
              {formatBytes(originalSize)} → {formatBytes(compressedSize)}
            </div>
            {compressionRate > 0 && (
              <div className="font-medium text-primary">
                -{compressionRate.toFixed(1)}%
              </div>
            )}
          </div>
          <Button
            disabled={!compressedSvg}
            onClick={onCopy}
            type="button"
            variant="outline"
          >
            <span className="i-hugeicons-copy-01 mr-1 size-4" />
            {header.copy}
          </Button>
          <Button disabled={!compressedSvg} onClick={onDownload} type="button">
            <span className="i-hugeicons-download-01 mr-1 size-4" />
            {header.download}
          </Button>
          {isSettingsCollapsed && onToggleSettings && (
            <>
              <Separator className="h-8" orientation="vertical" />
              <Button
                className="hidden md:flex"
                onClick={onToggleSettings}
                size="icon"
                type="button"
                variant="outline"
              >
                <span className="i-hugeicons-arrow-left-02 size-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
