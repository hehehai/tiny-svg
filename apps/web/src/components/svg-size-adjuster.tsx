import { Button } from "@tiny-svg/ui/components/button";
import { Input } from "@tiny-svg/ui/components/input";
import { Label } from "@tiny-svg/ui/components/label";
import { useState } from "react";
import {
  calculateProportionalDimensions,
  getSvgDimensions,
} from "@/lib/svg-transform";

interface SvgSizeAdjusterProps {
  svg: string;
  onApply: (newWidth: number, newHeight: number) => void;
  onCancel: () => void;
}

export function SvgSizeAdjuster({
  svg,
  onApply,
  onCancel,
}: SvgSizeAdjusterProps) {
  const dimensions = getSvgDimensions(svg);
  const [width, setWidth] = useState(dimensions?.width.toString() || "");
  const [height, setHeight] = useState(dimensions?.height.toString() || "");

  if (!dimensions) {
    return null;
  }

  const handleWidthChange = (value: string) => {
    setWidth(value);
    const numValue = Number.parseFloat(value);
    if (!Number.isNaN(numValue) && numValue > 0) {
      const newDimensions = calculateProportionalDimensions(
        dimensions.width,
        dimensions.height,
        numValue,
        "width"
      );
      setHeight(newDimensions.height.toString());
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    const numValue = Number.parseFloat(value);
    if (!Number.isNaN(numValue) && numValue > 0) {
      const newDimensions = calculateProportionalDimensions(
        dimensions.width,
        dimensions.height,
        numValue,
        "height"
      );
      setWidth(newDimensions.width.toString());
    }
  };

  const handleApply = () => {
    const w = Number.parseFloat(width);
    const h = Number.parseFloat(height);
    if (!(Number.isNaN(w) || Number.isNaN(h)) && w > 0 && h > 0) {
      onApply(w, h);
    }
  };

  const handleReset = () => {
    setWidth(dimensions.width.toString());
    setHeight(dimensions.height.toString());
  };

  return (
    <div className="absolute top-full right-0 z-50 mt-2 w-64 rounded-md border bg-popover p-4 shadow-md">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            onChange={(e) => handleWidthChange(e.target.value)}
            type="number"
            value={width}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            onChange={(e) => handleHeightChange(e.target.value)}
            type="number"
            value={height}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleApply}
              size="sm"
              type="button"
            >
              Apply
            </Button>
            <Button
              className="flex-1"
              onClick={onCancel}
              size="sm"
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
          <Button
            className="w-full"
            onClick={handleReset}
            size="sm"
            type="button"
            variant="secondary"
          >
            <i className="i-hugeicons-refresh mr-2 size-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
