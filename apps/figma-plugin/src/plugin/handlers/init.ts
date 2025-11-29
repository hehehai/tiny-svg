import { handleGetPresets } from "./presets";
import { handleGetSelection } from "./selection";

/**
 * Initialize plugin - load presets and get initial selection
 */
export async function handleInit(): Promise<void> {
  // Load presets and send to UI
  await handleGetPresets();

  // Get initial selection
  await handleGetSelection();
}
