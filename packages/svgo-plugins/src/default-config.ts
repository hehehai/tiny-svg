import type { SvgoGlobalSettings, SvgoPluginConfig } from "./types.js";

export const defaultGlobalSettings: SvgoGlobalSettings = {
  multipass: true,
  js2svg: {
    indent: 0,
    pretty: false,
  },
  svg2js: {
    indent: 2,
    pretty: false,
  },
  errorReporting: "none",
};

export const defaultSvgoPlugins: SvgoPluginConfig[] = [
  {
    name: "cleanupAttrs",
    enabled: true,
    description:
      "Cleanup attributes from newlines, trailing, and repeating spaces",
  },
  {
    name: "cleanupEnableBackground",
    enabled: true,
    description: "Remove or cleanup enable-background attribute when possible",
  },
  {
    name: "cleanupIDs",
    enabled: true,
    description: "Remove unused IDs and minify used",
  },
  {
    name: "cleanupNumericValues",
    enabled: true,
    description: "Round numeric values to the precision of 2 decimal places",
  },
  {
    name: "collapseGroups",
    enabled: true,
    description: "Collapse useless groups",
  },
  {
    name: "convertColors",
    enabled: true,
    description: "Convert colors from #rrggbb to #rgb",
  },
  {
    name: "convertPathData",
    enabled: true,
    description:
      "Convert path data to relative or absolute whichever is shorter",
  },
  {
    name: "convertShapeToPath",
    enabled: true,
    description: "Convert some basic shapes to <path>",
  },
  {
    name: "convertStyleToAttrs",
    enabled: true,
    description: "Convert styles into attributes",
  },
  {
    name: "convertTransform",
    enabled: true,
    description: "Collapse multiple transforms into one",
  },
  {
    name: "mergePaths",
    enabled: true,
    description: "Merge multiple paths into one",
  },
  {
    name: "mergeStyles",
    enabled: true,
    description: "Merge multiple styles into one",
  },
  {
    name: "minifyStyles",
    enabled: true,
    description: "Minify <style> elements content with CSSO",
  },
  {
    name: "moveElemsAttrsToGroup",
    enabled: true,
    description: "Move elements' attributes to their enclosing group",
  },
  {
    name: "moveGroupAttrsToElems",
    enabled: true,
    description: "Move some group attributes to the contained elements",
  },
  {
    name: "removeComments",
    enabled: true,
    description: "Remove comments",
  },
  {
    name: "removeDesc",
    enabled: true,
    description: "Remove <desc>",
  },
  {
    name: "removeDoctype",
    enabled: true,
    description: "Remove doctype declaration",
  },
  {
    name: "removeEditorsNSData",
    enabled: true,
    description: "Remove editors namespaces, elements, and attributes",
  },
  {
    name: "removeEmptyAttrs",
    enabled: true,
    description: "Remove empty attributes",
  },
  {
    name: "removeEmptyContainers",
    enabled: true,
    description: "Remove empty container elements",
  },
  {
    name: "removeEmptyText",
    enabled: true,
    description: "Remove empty <text> elements",
  },
  {
    name: "removeHiddenElems",
    enabled: true,
    description: "Remove hidden elements",
  },
  {
    name: "removeMetadata",
    enabled: true,
    description: "Remove <metadata>",
  },
  {
    name: "removeNonInheritableGroupAttrs",
    enabled: true,
    description: "Remove non-inheritable group's presentation attributes",
  },
  {
    name: "removeRasterImages",
    enabled: false,
    description: "Remove raster images (disabled by default)",
  },
  {
    name: "removeScriptElement",
    enabled: true,
    description: "Remove <script> elements",
  },
  {
    name: "removeStyleElement",
    enabled: true,
    description: "Remove <style> elements",
  },
  {
    name: "removeTitle",
    enabled: true,
    description: "Remove <title>",
  },
  {
    name: "removeUnknownsAndDefaults",
    enabled: true,
    description:
      "Remove unknown elements content and attributes, remove attrs with default values",
  },
  {
    name: "removeUnusedNS",
    enabled: true,
    description: "Remove unused namespaces declaration",
  },
  {
    name: "removeUselessDefs",
    enabled: true,
    description: "Remove useless <defs>",
  },
  {
    name: "removeUselessStrokeAndFill",
    enabled: true,
    description: "Remove useless stroke and fill attributes",
  },
  {
    name: "removeXMLProcInst",
    enabled: true,
    description: "Remove XML processing instructions",
  },
  {
    name: "sortAttrs",
    enabled: true,
    description: "Sort element attributes for better compression",
  },
  {
    name: "sortDefsChildren",
    enabled: true,
    description: "Sort children of <defs> to improve compression",
  },
];
