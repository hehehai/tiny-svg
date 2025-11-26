import type { SvgBatchItem } from "@tiny-svg/svg-core";
import { compressionPresets } from "@tiny-svg/svgo-plugins";
import { create } from "zustand";

interface PluginState {
  selectedSvgs: SvgBatchItem[];
  compressedSvgs: SvgBatchItem[];
  selectedPreset: string;
  isLoading: boolean;
  error: string | null;
  selectedFramework: string;
}

interface PluginActions {
  setSelectedSvgs: (svgs: SvgBatchItem[]) => void;
  setCompressedSvgs: (svgs: SvgBatchItem[]) => void;
  setSelectedPreset: (preset: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedFramework: (framework: string) => void;
  compressSvgs: () => Promise<void>;
  replaceSvg: (nodeId: string, svg: string) => Promise<void>;
  exportCode: (svg: string, framework: string) => void;
  reset: () => void;
}

const initialState: PluginState = {
  selectedSvgs: [],
  compressedSvgs: [],
  selectedPreset: compressionPresets[0].id,
  isLoading: false,
  error: null,
  selectedFramework: "react",
};

export const usePluginStore = create<PluginState & PluginActions>(
  (set, get) => ({
    ...initialState,

    setSelectedSvgs: (svgs) => set({ selectedSvgs: svgs, error: null }),

    setCompressedSvgs: (svgs) => set({ compressedSvgs: svgs }),

    setSelectedPreset: (preset) => set({ selectedPreset: preset }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    setSelectedFramework: (framework) => set({ selectedFramework: framework }),

    compressSvgs: async () => {
      const { selectedSvgs, selectedPreset } = get();

      if (selectedSvgs.length === 0) {
        set({ error: "No SVGs selected" });
        return;
      }

      set({ isLoading: true, error: null });

      try {
        parent.postMessage(
          {
            pluginMessage: {
              type: "compress-svgs",
              data: {
                svgs: selectedSvgs.map((svg) => ({
                  id: svg.id,
                  name: svg.layerName,
                  svg: svg.originalSvg,
                })),
                presetId: selectedPreset,
              },
            },
          },
          "*"
        );
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    replaceSvg: async (nodeId: string, svg: string) => {
      set({ isLoading: true, error: null });

      try {
        parent.postMessage(
          {
            pluginMessage: {
              type: "replace-svg",
              data: { nodeId, svg },
            },
          },
          "*"
        );
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
      }
    },

    exportCode: (svg: string, framework: string) => {
      parent.postMessage(
        {
          pluginMessage: {
            type: "export-code",
            data: { svg, framework },
          },
        },
        "*"
      );
    },

    reset: () => set(initialState),
  })
);
