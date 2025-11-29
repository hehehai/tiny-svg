import type { Config as SvgoConfig } from "svgo";

export interface SvgoPluginConfig {
  name: string;
  enabled: boolean;
  description?: string;
  params?: Record<string, unknown>;
}

export interface SvgoGlobalSettings {
  multipass: boolean;
  js2svg: {
    indent: number;
    pretty: boolean;
  };
  svg2js: {
    indent: number;
    pretty: boolean;
  };
  errorReporting: "none" | "throw" | "warn";
}

export interface SvgoPreset {
  name: string;
  description: string;
  config: SvgoConfig;
  plugins: SvgoPluginConfig[];
}

export interface PluginOverride {
  name: string;
  active: boolean;
}

export interface CompressionPreset {
  id: string;
  name: string;
  description: string;
  icon?: string;
  plugins: (string | PluginOverride)[];
  globalSettings?: Partial<SvgoGlobalSettings>;
}
