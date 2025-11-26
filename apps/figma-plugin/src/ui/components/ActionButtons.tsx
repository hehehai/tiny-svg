import { usePluginStore } from "../store/plugin-store";

function getButtonText(isLoading: boolean, hasCompressed: boolean): string {
  if (isLoading) {
    return "Processing...";
  }
  if (hasCompressed) {
    return "Re-compress";
  }
  return "Compress SVGs";
}

export function ActionButtons() {
  const { selectedSvgs, compressedSvgs, compressSvgs, isLoading, reset } =
    usePluginStore();

  const hasSelection = selectedSvgs.length > 0;
  const hasCompressed = compressedSvgs.length > 0;

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        className="btn btn-primary btn-block"
        disabled={!hasSelection || isLoading}
        onClick={compressSvgs}
        type="button"
      >
        {getButtonText(isLoading, hasCompressed)}
      </button>

      {hasCompressed && (
        <button className="btn btn-secondary" onClick={reset} type="button">
          Reset
        </button>
      )}
    </div>
  );
}
