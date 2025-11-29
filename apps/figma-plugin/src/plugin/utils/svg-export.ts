import type { FigmaNodeData } from "@/types/messages";

/**
 * Check if a node can be exported as SVG
 */
export function canExportAsSvg(node: SceneNode): boolean {
  return "exportAsync" in node;
}

/**
 * Export a Figma node as SVG string
 */
export async function exportNodeAsSvg(
  node: SceneNode
): Promise<FigmaNodeData | null> {
  try {
    const svgBytes = await (node as ExportMixin).exportAsync({
      format: "SVG",
      contentsOnly: false,
    });

    // Convert Uint8Array to string (TextDecoder not available in Figma sandbox)
    let svgString = "";
    for (const byte of svgBytes) {
      svgString += String.fromCharCode(byte);
    }

    return {
      id: node.id,
      nodeId: node.id,
      name: node.name || "Untitled",
      svg: svgString,
    };
  } catch (error) {
    console.error(`Failed to export node "${node.name}":`, error);
    return null;
  }
}

/**
 * Export multiple Figma nodes as SVG
 */
export async function exportNodesAsSvg(
  nodes: readonly SceneNode[]
): Promise<FigmaNodeData[]> {
  const items: FigmaNodeData[] = [];

  for (const node of nodes) {
    if (canExportAsSvg(node)) {
      const svgData = await exportNodeAsSvg(node);
      if (svgData) {
        items.push(svgData);
      }
    }
  }

  return items;
}
