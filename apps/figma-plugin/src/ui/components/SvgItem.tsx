import type { SvgBatchItem } from "@tiny-svg/svg-core";
import { formatSize } from "@tiny-svg/svg-core";
import { useState } from "react";
import { usePluginStore } from "../store/plugin-store";

interface SvgItemProps {
  svg: SvgBatchItem;
  isCompressed: boolean;
}

export function SvgItem({ svg, isCompressed }: SvgItemProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { replaceSvg, exportCode, selectedFramework } = usePluginStore();

  const currentSvg = isCompressed ? svg.compressedSvg : svg.originalSvg;
  const currentSize = isCompressed ? svg.compressedSize : svg.originalSize;

  return (
    <div className="card">
      <div className="card-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>{svg.layerName}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="badge">{formatSize(currentSize ?? 0)}</span>
            {isCompressed && (svg.compressionRatio ?? 0) > 0 && (
              <span className="badge badge-success">
                -{svg.compressionRatio}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card-content">
        <div style={{ marginBottom: "8px" }}>
          <button
            className="btn btn-sm"
            onClick={() => setShowPreview(!showPreview)}
            type="button"
          >
            {showPreview ? "Hide" : "Show"} Preview
          </button>
        </div>

        {showPreview && (
          <div
            style={{
              marginBottom: "12px",
              padding: "8px",
              background: "var(--figma-color-bg-secondary)",
              borderRadius: "4px",
              maxHeight: "120px",
              overflow: "auto",
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html:
                  currentSvg.length > 200
                    ? `${currentSvg.substring(0, 200)}...`
                    : currentSvg,
              }}
              style={{ fontSize: "10px", lineHeight: "1.4" }}
            />
          </div>
        )}

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {isCompressed && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => replaceSvg(svg.nodeId, svg.compressedSvg)}
              type="button"
            >
              Replace in Figma
            </button>
          )}

          <button
            className="btn btn-sm btn-secondary"
            onClick={() => exportCode(currentSvg, selectedFramework)}
            type="button"
          >
            Export Code
          </button>
        </div>
      </div>
    </div>
  );
}
