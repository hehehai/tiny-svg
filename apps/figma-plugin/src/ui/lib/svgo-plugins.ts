/**
 * SVGO Plugin definitions
 * Simplified version for Figma plugin
 */

export type SvgoPluginConfig = {
  name: string;
  enabled: boolean;
};

export type SvgoGlobalSettings = {
  multipass: boolean;
  floatPrecision: number;
  transformPrecision: number;
};

export const defaultGlobalSettings: SvgoGlobalSettings = {
  multipass: true,
  floatPrecision: 3,
  transformPrecision: 5,
};

/**
 * List of all available SVGO plugins with their default states
 */
export const allSvgoPlugins: SvgoPluginConfig[] = [
  // Structure cleanup
  { name: "removeDoctype", enabled: true },
  { name: "removeXMLProcInst", enabled: true },
  { name: "removeComments", enabled: true },
  { name: "removeMetadata", enabled: true },
  { name: "removeEditorsNSData", enabled: true },

  // Document structure
  { name: "cleanupAttrs", enabled: true },
  { name: "mergeStyles", enabled: true },
  { name: "inlineStyles", enabled: true },
  { name: "minifyStyles", enabled: true },
  { name: "cleanupIds", enabled: true },
  { name: "removeUselessDefs", enabled: true },
  { name: "cleanupNumericValues", enabled: true },

  // Transforms
  { name: "convertColors", enabled: true },
  { name: "removeUnknownsAndDefaults", enabled: true },
  { name: "removeNonInheritableGroupAttrs", enabled: true },
  { name: "removeUselessStrokeAndFill", enabled: true },
  { name: "removeViewBox", enabled: false },
  { name: "cleanupEnableBackground", enabled: true },
  { name: "removeHiddenElems", enabled: true },
  { name: "removeEmptyText", enabled: true },
  { name: "convertShapeToPath", enabled: true },
  { name: "convertEllipseToCircle", enabled: true },
  { name: "moveElemsAttrsToGroup", enabled: true },
  { name: "moveGroupAttrsToElems", enabled: true },
  { name: "collapseGroups", enabled: true },
  { name: "convertPathData", enabled: true },
  { name: "convertTransform", enabled: true },
  { name: "removeEmptyAttrs", enabled: true },
  { name: "removeEmptyContainers", enabled: true },
  { name: "mergePaths", enabled: true },
  { name: "removeUnusedNS", enabled: true },
  { name: "sortAttrs", enabled: false },
  { name: "sortDefsChildren", enabled: true },
  { name: "removeTitle", enabled: false },
  { name: "removeDesc", enabled: true },

  // Accessibility
  { name: "removeOffCanvasPaths", enabled: false },
  { name: "reusePaths", enabled: false },

  // SVG presentation attributes
  { name: "removeStyleElement", enabled: false },
  { name: "removeScriptElement", enabled: false },
  { name: "removeDimensions", enabled: false },
  { name: "removeXMLNS", enabled: false },
];
