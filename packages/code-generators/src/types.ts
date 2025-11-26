export interface CodeGeneratorOptions {
  framework:
    | "react"
    | "vue"
    | "svelte"
    | "react-native"
    | "flutter"
    | "data-uri";
  componentName?: string;
  props?: Record<string, unknown>;
  optimize?: boolean;
  typescript?: boolean;
  format?: "prettier" | "none";
}

export interface GenerationResult {
  code: string;
  language: string;
  filename: string;
  size: number;
}

export interface FrameworkConfig {
  name: string;
  extensions: string[];
  template: (svg: string, options: CodeGeneratorOptions) => string;
}
