import type { Config as SvgoConfig } from "svgo";
import { create } from "zustand";
import {
  allSvgoPlugins,
  defaultGlobalSettings,
  type SvgoGlobalSettings,
  type SvgoPluginConfig,
} from "@/lib/svgo-plugins";

// Note: SvgoConfig type is imported but SVGO library is NOT bundled
// SVGO is only used in workers (svgo.worker.ts)

export type SvgState = {
  originalSvg: string;
  compressedSvg: string;
  fileName: string;
  svgoConfig: SvgoConfig;
  plugins: SvgoPluginConfig[];
  globalSettings: SvgoGlobalSettings;
};

type SvgActions = {
  setOriginalSvg: (svg: string, fileName: string) => void;
  setCompressedSvg: (svg: string) => void;
  setHistoryEntry: (entry: {
    originalSvg: string;
    compressedSvg: string;
    fileName: string;
  }) => void;
  setSvgoConfig: (config: SvgoConfig) => void;
  togglePlugin: (pluginName: string) => void;
  updateGlobalSettings: (settings: Partial<SvgoGlobalSettings>) => void;
  resetPlugins: () => void;
  reset: () => void;
  applyTransformation: (transformedSvg: string) => void;
};

const defaultSvgoConfig: SvgoConfig = {
  multipass: true,
  plugins: ["preset-default"],
};

const initialState: SvgState = {
  originalSvg: "",
  compressedSvg: "",
  fileName: "",
  svgoConfig: defaultSvgoConfig,
  plugins: allSvgoPlugins,
  globalSettings: defaultGlobalSettings,
};

export const useSvgStore = create<SvgState & SvgActions>((set) => ({
  ...initialState,
  setOriginalSvg: (svg, fileName) =>
    set({ originalSvg: svg, fileName, compressedSvg: "" }),
  setCompressedSvg: (svg) => set({ compressedSvg: svg }),
  setHistoryEntry: ({ originalSvg, compressedSvg, fileName }) =>
    set({ originalSvg, compressedSvg, fileName }),
  setSvgoConfig: (config) => set({ svgoConfig: config }),
  togglePlugin: (pluginName) =>
    set((state) => ({
      plugins: state.plugins.map((p) =>
        p.name === pluginName ? { ...p, enabled: !p.enabled } : p
      ),
    })),
  updateGlobalSettings: (settings) =>
    set((state) => ({
      globalSettings: { ...state.globalSettings, ...settings },
    })),
  resetPlugins: () => set({ plugins: allSvgoPlugins }),
  reset: () => set(initialState),
  applyTransformation: (transformedSvg) =>
    set({ originalSvg: transformedSvg, compressedSvg: "" }),
}));
