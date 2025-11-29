import { emit } from "@create-figma-plugin/utilities";
import type { FigmaNodeData, SelectionChangedHandler } from "@/types/messages";
import { handleAsyncError } from "../utils/notifications";
import { exportNodesAsSvg } from "../utils/svg-export";

/**
 * Handle selection change and export selected nodes as SVG
 */
export async function handleGetSelection(): Promise<void> {
  await handleAsyncError(async () => {
    const selection = figma.currentPage.selection;
    const items: FigmaNodeData[] = await exportNodesAsSvg(selection);
    emit<SelectionChangedHandler>("SELECTION_CHANGED", items);
  }, "Failed to get selection");
}
