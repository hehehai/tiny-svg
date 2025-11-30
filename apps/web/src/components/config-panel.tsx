import { Button } from "@tiny-svg/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@tiny-svg/ui/components/card";
import { Input } from "@tiny-svg/ui/components/input";
import { Label } from "@tiny-svg/ui/components/label";
import { Switch } from "@tiny-svg/ui/components/switch";
import { useCallback, useEffect } from "react";
import { useIntlayer } from "react-intlayer";
import {
  DEFAULT_SVG_DIMENSION,
  EXPORT_SCALE_OPTIONS,
  SCALE_MATCH_THRESHOLD,
  VIEWBOX_SPLIT_PATTERN,
  VIEWBOX_VALUES_COUNT,
} from "@/lib/constants";
import { useSvgStore } from "@/store/svg-store";
import { type ExportScale, useUiStore } from "@/store/ui-store";
import { ExportPanel } from "./export-panel";

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
  const { settings } = useIntlayer("optimize");
  const pluginLabels = useIntlayer("plugins");

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
    const matchingScale = EXPORT_SCALE_OPTIONS.find(
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
    const matchingScale = EXPORT_SCALE_OPTIONS.find(
      (s) => Math.abs(s - scale) < SCALE_MATCH_THRESHOLD
    );
    setExportScale(matchingScale || null);
  };

  if (isCollapsed) {
    return <div className={className} />;
  }

  return (
    <div className={`flex flex-col ${className || ""}`}>
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

      <div className="flex-1 space-y-4 overflow-y-auto">
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
                  {(pluginLabels as Record<string, string>)[plugin.name] ||
                    plugin.name}
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
        <ExportPanel
          compressedSvg={compressedSvg}
          exportHeight={exportHeight}
          exportScale={exportScale}
          exportWidth={exportWidth}
          fileName={fileName}
          onHeightChange={handleHeightChange}
          onScaleChange={handleScaleChange}
          onWidthChange={handleWidthChange}
        />
      </div>
    </div>
  );
}
