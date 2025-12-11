// not included in the pack
import type { SvgPacker } from "./index.js";

declare module "node:stream" {
  interface PassThrough {
    metadata?: {
      unicode: string[];
      name: string;
    };
  }
}

declare global {
  interface Window {
    SvgPacker: typeof SvgPacker;
  }
}
