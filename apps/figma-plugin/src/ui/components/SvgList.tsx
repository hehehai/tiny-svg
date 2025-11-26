import { formatSize } from "@tiny-svg/svg-core";
import { usePluginStore } from "../store/plugin-store";
import { SvgItem } from "./SvgItem";

export function SvgList() {
  const { selectedSvgs, compressedSvgs } = usePluginStore();

  const displaySvgs = compressedSvgs.length > 0 ? compressedSvgs : selectedSvgs;

  if (selectedSvgs.length === 0) {
    return (
      <div className="card">
        <div className="card-content text-center">
          <p className="text-secondary">No SVGs selected</p>
          <p className="text-tertiary text-xs">
            Select one or more SVG layers in Figma to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="plugin-header" style={{ padding: "0 0 12px 0" }}>
        <h2>Selected SVGs ({selectedSvgs.length})</h2>
        {compressedSvgs.length > 0 && (
          <p className="text-secondary text-xs">
            Total saved:{" "}
            {formatSize(
              selectedSvgs.reduce(
                (sum, svg) => sum + (svg.originalSize || 0),
                0
              ) -
                compressedSvgs.reduce(
                  (sum, svg) => sum + (svg.compressedSize || 0),
                  0
                )
            )}
          </p>
        )}
      </div>

      {displaySvgs.map((svg) => (
        <SvgItem
          isCompressed={compressedSvgs.length > 0}
          key={svg.id}
          svg={svg}
        />
      ))}
    </div>
  );
}
