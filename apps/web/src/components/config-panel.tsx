import { useCallback, useEffect } from "react";
import { useIntlayer, useLocale } from "react-intlayer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { exportAsJpeg, exportAsPng } from "@/lib/file-utils";
import { getPluginLabel } from "@/lib/svgo-plugins";
import { useSvgStore } from "@/store/svg-store";
import { type ExportScale, useUiStore } from "@/store/ui-store";

// Constants
const VIEWBOX_SPLIT_PATTERN = /\s+|,/;
const VIEWBOX_VALUES_COUNT = 4;
const DEFAULT_SVG_DIMENSION = 100;
const SCALE_MATCH_THRESHOLD = 0.01;
const JPEG_QUALITY = 0.95;
// biome-ignore lint/style/noMagicNumbers: These are configuration values for export scale presets
const SCALE_OPTIONS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 7, 8] as const;

type ConfigPanelProps = {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
};

export function ConfigPanel({
  isCollapsed,
  onToggleCollapse,
  className,
}: ConfigPanelProps) {
  const {
    plugins,
    globalSettings,
    togglePlugin,
    updateGlobalSettings,
    resetPlugins,
    compressedSvg,
    fileName,
    originalSvg,
  } = useSvgStore();
  const {
    activeTab,
    setActiveTab,
    exportScale,
    exportWidth,
    exportHeight,
    setExportScale,
    setExportDimensions,
  } = useUiStore();
  const { settings, messages } = useIntlayer("optimize");
  const { locale } = useLocale();

  // 提供默认值，防止服务器端渲染错误
  const safeSettings = settings || {
    title: "Settings",
    global: {
      title: "Global Settings",
      showOriginal: "Show original",
      compareGzipped: "Compare gzipped",
      prettifyMarkup: "Prettify markup",
      multipass: "Multipass",
      numberPrecision: "Number precision",
      transformPrecision: "Transform precision",
    },
    features: {
      title: "Features",
      resetAll: "Reset all",
    },
    export: {
      title: "Export",
      png: "Export as PNG",
      jpeg: "Export as JPEG",
    },
  };

  const safeMessages = messages || {
    noSvgToExport: "No optimized SVG to export",
    exportPngSuccess: "Exported as PNG!",
    exportJpegSuccess: "Exported as JPEG!",
    exportError: "Failed to export",
  };

  // Get SVG dimensions
  const getSvgDimensions = useCallback(
    (svg: string): { width: number; height: number } => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "image/svg+xml");
      const svgElement = doc.querySelector("svg");

      if (!svgElement) {
        return { width: DEFAULT_SVG_DIMENSION, height: DEFAULT_SVG_DIMENSION };
      }

      let width: string | null = svgElement.getAttribute("width");
      let height: string | null = svgElement.getAttribute("height");

      if (!(width && height)) {
        const viewBox = svgElement.getAttribute("viewBox");
        if (viewBox) {
          const values = viewBox.split(VIEWBOX_SPLIT_PATTERN);
          if (values.length === VIEWBOX_VALUES_COUNT) {
            width = values[2] ?? null;
            height = values[3] ?? null;
          }
        }
      }

      const parseSize = (size: string | null): number => {
        if (!size) {
          return DEFAULT_SVG_DIMENSION;
        }
        const parsed = Number.parseFloat(size);
        return Number.isNaN(parsed) ? DEFAULT_SVG_DIMENSION : parsed;
      };

      return {
        width: parseSize(width),
        height: parseSize(height),
      };
    },
    []
  );

  // Initialize export dimensions when SVG changes
  useEffect(() => {
    const svg = compressedSvg || originalSvg;
    if (svg) {
      const { width, height } = getSvgDimensions(svg);
      const scale = exportScale || 2;
      setExportDimensions(
        Math.round(width * scale),
        Math.round(height * scale)
      );
    }
  }, [
    compressedSvg,
    originalSvg,
    exportScale,
    getSvgDimensions,
    setExportDimensions,
  ]);

  // Get current SVG dimensions and aspect ratio
  const currentSvg = compressedSvg || originalSvg;
  const svgDimensions = currentSvg
    ? getSvgDimensions(currentSvg)
    : { width: DEFAULT_SVG_DIMENSION, height: DEFAULT_SVG_DIMENSION };
  const aspectRatio = svgDimensions.width / svgDimensions.height;

  // Handle scale change
  const handleScaleChange = (value: string) => {
    const scale =
      value === "custom" ? null : (Number.parseFloat(value) as ExportScale);
    setExportScale(scale);

    if (scale !== null) {
      setExportDimensions(
        Math.round(svgDimensions.width * scale),
        Math.round(svgDimensions.height * scale)
      );
    }
  };

  // Handle width change
  const handleWidthChange = (value: string) => {
    const width = Number.parseInt(value, 10);
    if (Number.isNaN(width) || width <= 0) {
      return;
    }

    const height = Math.round(width / aspectRatio);
    setExportDimensions(width, height);

    // Check if it matches any preset scale
    const scale = width / svgDimensions.width;
    const matchingScale = SCALE_OPTIONS.find(
      (s) => Math.abs(s - scale) < SCALE_MATCH_THRESHOLD
    );
    setExportScale(matchingScale || null);
  };

  // Handle height change
  const handleHeightChange = (value: string) => {
    const height = Number.parseInt(value, 10);
    if (Number.isNaN(height) || height <= 0) {
      return;
    }

    const width = Math.round(height * aspectRatio);
    setExportDimensions(width, height);

    // Check if it matches any preset scale
    const scale = height / svgDimensions.height;
    const matchingScale = SCALE_OPTIONS.find(
      (s) => Math.abs(s - scale) < SCALE_MATCH_THRESHOLD
    );
    setExportScale(matchingScale || null);
  };

  if (isCollapsed) {
    return <div className={className} />;
  }

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
        JPEG_QUALITY,
        exportWidth,
        exportHeight
      );
      toast.success(safeMessages.exportJpegSuccess);
    } catch {
      toast.error(safeMessages.exportError);
    }
  };

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">{safeSettings.title}</h2>
        <Button
          onClick={onToggleCollapse}
          size="sm"
          type="button"
          variant="ghost"
        >
          <span className="i-hugeicons-arrow-right-02 size-4" />
        </Button>
      </div>

      <div className="max-h-[calc(100vh-9rem)] space-y-4 overflow-y-auto">
        {/* Global Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {safeSettings.global.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm" htmlFor="show-original">
                {safeSettings.global.showOriginal}
              </Label>
              <Switch
                checked={globalSettings.showOriginal}
                id="show-original"
                onCheckedChange={(checked) => {
                  updateGlobalSettings({ showOriginal: checked });
                  // Auto-focus to original tab when enabled
                  if (checked) {
                    setActiveTab("original");
                  } else if (activeTab === "original") {
                    // Switch to optimized tab when disabled and currently on original
                    setActiveTab("optimized");
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm" htmlFor="compare-gzipped">
                {safeSettings.global.compareGzipped}
              </Label>
              <Switch
                checked={globalSettings.compareGzipped}
                id="compare-gzipped"
                onCheckedChange={(checked) =>
                  updateGlobalSettings({ compareGzipped: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm" htmlFor="prettify">
                {safeSettings.global.prettifyMarkup}
              </Label>
              <Switch
                checked={globalSettings.prettifyMarkup}
                id="prettify"
                onCheckedChange={(checked) =>
                  updateGlobalSettings({ prettifyMarkup: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm" htmlFor="multipass">
                {safeSettings.global.multipass}
              </Label>
              <Switch
                checked={globalSettings.multipass}
                id="multipass"
                onCheckedChange={(checked) =>
                  updateGlobalSettings({ multipass: checked })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm" htmlFor="float-precision">
                {safeSettings.global.numberPrecision}
              </Label>
              <Input
                className="h-8"
                id="float-precision"
                max={10}
                min={0}
                onChange={(e) =>
                  updateGlobalSettings({
                    floatPrecision: Number.parseInt(e.target.value, 10),
                  })
                }
                type="number"
                value={globalSettings.floatPrecision}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm" htmlFor="transform-precision">
                {safeSettings.global.transformPrecision}
              </Label>
              <Input
                className="h-8"
                id="transform-precision"
                max={10}
                min={0}
                onChange={(e) =>
                  updateGlobalSettings({
                    transformPrecision: Number.parseInt(e.target.value, 10),
                  })
                }
                type="number"
                value={globalSettings.transformPrecision}
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {safeSettings.features.title}
              </CardTitle>
              <Button
                onClick={resetPlugins}
                size="sm"
                type="button"
                variant="ghost"
              >
                {safeSettings.features.resetAll}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {plugins.map((plugin) => (
              <div
                className="flex items-center justify-between py-1"
                key={plugin.name}
              >
                <Label className="cursor-pointer text-sm" htmlFor={plugin.name}>
                  {getPluginLabel(plugin.name, locale)}
                </Label>
                <Switch
                  checked={plugin.enabled}
                  id={plugin.name}
                  onCheckedChange={() => togglePlugin(plugin.name)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-1">
              <h3 className="text-base">{safeSettings.export.title}</h3>
              <div className="flex items-center gap-1">
                {/* Scale Selector */}
                <div>
                  <Label className="sr-only text-xs" htmlFor="export-scale">
                    {safeSettings.export.scale}
                  </Label>
                  <Select
                    onValueChange={handleScaleChange}
                    value={exportScale?.toString() || "custom"}
                  >
                    <SelectTrigger
                      className="w-14 px-2 data-[size=default]:h-8 md:text-xs"
                      id="export-scale"
                    >
                      <SelectValue placeholder="--" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCALE_OPTIONS.map((scale) => (
                        <SelectItem key={scale} value={scale.toString()}>
                          {scale}x
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Width Input */}
                <div>
                  <Label className="sr-only text-xs" htmlFor="export-width">
                    {safeSettings.export.width}
                  </Label>
                  <Input
                    className="h-8 w-16 px-2 md:text-xs"
                    id="export-width"
                    min={1}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    type="number"
                    value={exportWidth || ""}
                  />
                </div>

                {/* Height Input */}
                <div>
                  <Label className="sr-only text-xs" htmlFor="export-height">
                    {safeSettings.export.height}
                  </Label>
                  <Input
                    className="h-8 w-16 px-2 md:text-xs"
                    id="export-height"
                    min={1}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    type="number"
                    value={exportHeight || ""}
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Export Buttons */}
            <div className="space-y-2 pt-1">
              <Button
                className="w-full"
                disabled={!compressedSvg}
                onClick={handleExportPng}
                type="button"
                variant="outline"
              >
                <span className="i-hugeicons-image-02 mr-2 size-4" />
                {safeSettings.export.png}
              </Button>
              <Button
                className="w-full"
                disabled={!compressedSvg}
                onClick={handleExportJpeg}
                type="button"
                variant="outline"
              >
                <span className="i-hugeicons-image-02 mr-2 size-4" />
                {safeSettings.export.jpeg}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
