import { handleGetLanguage } from "./language";
import { handleGetPresets } from "./presets";
import { handleGetSelection } from "./selection";

/**
 * Initialize plugin - load language preference, presets and get initial selection
 */
export async function handleInit(): Promise<void> {
  // Load language preference first
  await handleGetLanguage();

  // Load presets and send to UI
  await handleGetPresets();

  // Get initial selection
  await handleGetSelection();
}
