// Figma Plugin Sandbox Code
// This runs in Figma's isolated sandbox environment (not the browser)

import { on } from "@create-figma-plugin/utilities";
import {
  handleDeletePreset,
  handleGetPresets,
  handleGetSelection,
  handleInit,
  handleResetPresets,
  handleSaveLanguage,
  handleSavePreset,
} from "./plugin/handlers";
import type {
  CloseHandler,
  DeletePresetHandler,
  GetPresetsHandler,
  GetSelectionHandler,
  InitHandler,
  ResetPresetsHandler,
  SaveLanguageHandler,
  SavePresetHandler,
} from "./types/messages";

// ============================================================================
// Constants
// ============================================================================

const UI_WIDTH = 380;
const UI_HEIGHT = 540;
const SELECTION_DEBOUNCE_MS = 150;

// ============================================================================
// Plugin Initialization
// ============================================================================

export default function () {
  // Show UI using Figma's native API
  figma.showUI(__html__, {
    width: UI_WIDTH,
    height: UI_HEIGHT,
    themeColors: true,
  });

  // Register message handlers
  registerMessageHandlers();

  // Register selection change listener
  registerSelectionListener();

  // Send initial data to UI
  handleInit();
}

// ============================================================================
// Message Handler Registration
// ============================================================================

function registerMessageHandlers(): void {
  on<InitHandler>("INIT", handleInit);
  on<GetSelectionHandler>("GET_SELECTION", handleGetSelection);
  on<GetPresetsHandler>("GET_PRESETS", handleGetPresets);
  on<SavePresetHandler>("SAVE_PRESET", handleSavePreset);
  on<DeletePresetHandler>("DELETE_PRESET", handleDeletePreset);
  on<ResetPresetsHandler>("RESET_PRESETS", handleResetPresets);
  on<SaveLanguageHandler>("SAVE_LANGUAGE", handleSaveLanguage);
  on<CloseHandler>("CLOSE", () => {
    figma.closePlugin();
  });
}

// ============================================================================
// Selection Change Listener
// ============================================================================

function registerSelectionListener(): void {
  let selectionChangeTimeout: ReturnType<typeof setTimeout> | null = null;

  figma.on("selectionchange", () => {
    if (selectionChangeTimeout) {
      clearTimeout(selectionChangeTimeout);
    }

    selectionChangeTimeout = setTimeout(() => {
      handleGetSelection();
    }, SELECTION_DEBOUNCE_MS);
  });
}
