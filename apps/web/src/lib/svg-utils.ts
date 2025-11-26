export function generateSvgThumbnail(
  svgContent: string,
  maxSize = 200
): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgElement = doc.documentElement;

    if (svgElement.nodeName !== "svg") {
      return svgContent;
    }

    const viewBox = svgElement.getAttribute("viewBox");
    if (viewBox) {
      const parts = viewBox.split(" ").map(Number);
      const width = parts[2];
      const height = parts[3];

      if (width && height) {
        const aspectRatio = width / height;

        let newWidth = maxSize;
        let newHeight = maxSize;

        if (aspectRatio > 1) {
          newHeight = maxSize / aspectRatio;
        } else {
          newWidth = maxSize * aspectRatio;
        }

        svgElement.setAttribute("width", String(newWidth));
        svgElement.setAttribute("height", String(newHeight));
      } else {
        svgElement.setAttribute("width", String(maxSize));
        svgElement.setAttribute("height", String(maxSize));
      }
    } else {
      svgElement.setAttribute("width", String(maxSize));
      svgElement.setAttribute("height", String(maxSize));
    }

    const serializer = new XMLSerializer();
    const thumbnailSvg = serializer.serializeToString(svgElement);

    return `data:image/svg+xml;base64,${btoa(thumbnailSvg)}`;
  } catch {
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  }
}

export function getSvgDimensions(
  svgContent: string
): { width: number; height: number } | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgElement = doc.documentElement;

    if (svgElement.nodeName !== "svg") {
      return null;
    }

    const viewBox = svgElement.getAttribute("viewBox");
    if (viewBox) {
      const parts = viewBox.split(" ").map(Number);
      const width = parts[2];
      const height = parts[3];
      if (width && height) {
        return { width, height };
      }
    }

    const width = Number.parseFloat(svgElement.getAttribute("width") ?? "0");
    const height = Number.parseFloat(svgElement.getAttribute("height") ?? "0");

    if (width && height) {
      return { width, height };
    }

    return null;
  } catch {
    return null;
  }
}

// Re-export from svg-core for backward compatibility
export { formatSize as formatFileSize } from "@tiny-svg/svg-core";

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) {
    return "Just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString();
}
