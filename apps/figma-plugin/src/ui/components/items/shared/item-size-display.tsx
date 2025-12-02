interface ItemSizeDisplayProps {
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: number;
  mode?: "full" | "compression-only";
}

const formatSize = (bytes: number | undefined): string => {
  if (!bytes) {
    return "-";
  }
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

const formatCompressionRatio = (ratio: number | undefined): string => {
  if (!ratio) {
    return "";
  }
  return `(-${Math.round(ratio * 100)}%)`;
};

export function ItemSizeDisplay({
  originalSize,
  compressedSize,
  compressionRatio,
  mode = "full",
}: ItemSizeDisplayProps) {
  if (mode === "compression-only") {
    return compressionRatio ? (
      <span className="font-semibold text-success">
        {formatCompressionRatio(compressionRatio)}
      </span>
    ) : null;
  }

  return compressedSize ? (
    <>
      <span className="line-through opacity-70">
        {formatSize(originalSize)}
      </span>
      {" → "}
      <span className="font-medium text-foreground">
        {formatSize(compressedSize)}
      </span>{" "}
      <span className="font-semibold text-success">
        {formatCompressionRatio(compressionRatio)}
      </span>
    </>
  ) : (
    <span>{formatSize(originalSize)}</span>
  );
}
