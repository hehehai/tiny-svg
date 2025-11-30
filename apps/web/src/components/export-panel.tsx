import { Button } from "@tiny-svg/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@tiny-svg/ui/components/card";
import { Input } from "@tiny-svg/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tiny-svg/ui/components/select";
import { useIntlayer } from "react-intlayer";
import { toast } from "sonner";
import {
  DEFAULT_JPEG_QUALITY,
  DEFAULT_WEBP_QUALITY,
  EXPORT_SCALE_OPTIONS,
} from "@/lib/constants";
import {
  exportAsIco,
  exportAsJpeg,
  exportAsPdf,
  exportAsPng,
  exportAsWebP,
} from "@/lib/file-utils";
import type { ExportScale } from "@/store/ui-store";

type ExportPanelProps = {
  compressedSvg: string | null;
  fileName: string;
  exportScale: ExportScale | null;
  exportWidth: number;
  exportHeight: number;
  onScaleChange: (value: string) => void;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
};

export function ExportPanel({
  compressedSvg,
  fileName,
  exportScale,
  exportWidth,
  exportHeight,
  onScaleChange,
  onWidthChange,
  onHeightChange,
}: ExportPanelProps) {
  const { settings, messages } = useIntlayer("optimize");

  const safeSettings = settings || {
    export: {
      title: "Export",
      png: "Export as PNG",
      jpeg: "Export as JPEG",
      webp: "Export as WebP",
      ico: "Export as ICO",
      pdf: "Export as PDF",
    },
  };

  const safeMessages = messages || {
    noSvgToExport: "No optimized SVG to export",
    exportPngSuccess: "Exported as PNG!",
    exportJpegSuccess: "Exported as JPEG!",
    exportWebpSuccess: "Exported as WebP!",
    exportIcoSuccess: "Exported as ICO!",
    exportPdfSuccess: "Exported as PDF!",
    exportError: "Failed to export",
  };

  const handleExportPng = async () => {
    if (!compressedSvg) {
      toast.error(safeMessages.noSvgToExport);
      return;
    }
    try {
      await exportAsPng(compressedSvg, fileName, exportWidth, exportHeight);
      toast.success(safeMessages.exportPngSuccess);
    } catch {
      toast.error(safeMessages.exportError);
    }
  };

  const handleExportJpeg = async () => {
    if (!compressedSvg) {
      toast.error(safeMessages.noSvgToExport);
      return;
    }
    try {
      await exportAsJpeg(
        compressedSvg,
        fileName,
        DEFAULT_JPEG_QUALITY,
        exportWidth,
        exportHeight
      );
      toast.success(safeMessages.exportJpegSuccess);
    } catch {
      toast.error(safeMessages.exportError);
    }
  };

  const handleExportWebP = async () => {
    if (!compressedSvg) {
      toast.error(safeMessages.noSvgToExport);
      return;
    }
    try {
      await exportAsWebP(
        compressedSvg,
        fileName,
        DEFAULT_WEBP_QUALITY,
        exportWidth,
        exportHeight
      );
      toast.success(safeMessages.exportWebpSuccess);
    } catch {
      toast.error(safeMessages.exportError);
    }
  };

  const handleExportIco = async () => {
    if (!compressedSvg) {
      toast.error(safeMessages.noSvgToExport);
      return;
    }
    try {
      await exportAsIco(compressedSvg, fileName, exportWidth, exportHeight);
      toast.success(safeMessages.exportIcoSuccess);
    } catch {
      toast.error(safeMessages.exportError);
    }
  };

  const handleExportPdf = async () => {
    if (!compressedSvg) {
      toast.error(safeMessages.noSvgToExport);
      return;
    }
    try {
      await exportAsPdf(compressedSvg, fileName, exportWidth, exportHeight);
      toast.success(safeMessages.exportPdfSuccess);
    } catch {
      toast.error(safeMessages.exportError);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-1">
          <h3 className="text-base">{safeSettings.export.title}</h3>
          {compressedSvg && (
            <div className="flex items-center gap-1">
              {/* Scale Selector */}
              <Select
                onValueChange={onScaleChange}
                value={exportScale?.toString() || "custom"}
              >
                <SelectTrigger
                  className="w-14 px-2 data-[size=default]:h-8 md:text-xs"
                  id="export-scale"
                >
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_SCALE_OPTIONS.map((scale) => (
                    <SelectItem key={scale} value={scale.toString()}>
                      {scale}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Width Input */}
              <Input
                className="h-8 w-16 px-2 md:text-xs"
                id="export-width"
                min={1}
                onChange={(e) => onWidthChange(e.target.value)}
                type="number"
                value={exportWidth || ""}
              />

              {/* Height Input */}
              <Input
                className="h-8 w-16 px-2 md:text-xs"
                id="export-height"
                min={1}
                onChange={(e) => onHeightChange(e.target.value)}
                type="number"
                value={exportHeight || ""}
              />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Export Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            className="w-full"
            disabled={!compressedSvg}
            onClick={handleExportPng}
            type="button"
            variant="outline"
          >
            <span className="i-hugeicons-image-02 mr-2 size-4" />
            PNG
          </Button>
          <Button
            className="w-full"
            disabled={!compressedSvg}
            onClick={handleExportJpeg}
            type="button"
            variant="outline"
          >
            <span className="i-hugeicons-image-02 mr-2 size-4" />
            JPEG
          </Button>
          <Button
            className="w-full"
            disabled={!compressedSvg}
            onClick={handleExportWebP}
            type="button"
            variant="outline"
          >
            <span className="i-hugeicons-image-02 mr-2 size-4" />
            WebP
          </Button>
          <Button
            className="w-full"
            disabled={!compressedSvg}
            onClick={handleExportIco}
            type="button"
            variant="outline"
          >
            <span className="i-hugeicons-image-02 mr-2 size-4" />
            ICO
          </Button>
          <Button
            className="col-span-2 w-full"
            disabled={!compressedSvg}
            onClick={handleExportPdf}
            type="button"
            variant="outline"
          >
            <span className="i-hugeicons-file-02 mr-2 size-4" />
            PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
