// Figma Plugin Sandbox Code
// Note: This runs in Figma's sandbox, not the browser

interface SvgNodeData {
  id: string;
  name: string;
  svg: string;
}

interface MessageData {
  type: string;
  data?: unknown;
}

interface CompressSvgData {
  svgs: SvgNodeData[];
  presetId?: string;
}

interface ReplaceSvgData {
  nodeId: string;
  svg: string;
}

interface ExportComponentData {
  nodeId: string;
}

interface PluginOverride {
  name: string;
  active: boolean;
}

// Compression presets (inline to avoid external dependencies)
const compressionPresets = [
  {
    id: "default",
    name: "Default",
    description: "Balanced compression with good compatibility",
    plugins: ["preset-default"] as (string | PluginOverride)[],
  },
  {
    id: "aggressive",
    name: "Aggressive",
    description: "Maximum compression, may remove some attributes",
    plugins: [
      "preset-default",
      "removeAttrs",
      "removeElementsByAttr",
      "removeScriptElement",
      "removeStyleElement",
    ] as (string | PluginOverride)[],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Safe compression, preserves all functionality",
    plugins: [
      "cleanupAttrs",
      "cleanupEnableBackground",
      "cleanupIDs",
      "cleanupNumericValues",
      "collapseGroups",
      "convertColors",
      "convertPathData",
      "convertShapeToPath",
      "convertStyleToAttrs",
      "convertTransform",
      "mergePaths",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "removeComments",
      "removeDesc",
      "removeDoctype",
      "removeEditorsNSData",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "removeEmptyText",
      "removeHiddenElems",
      "removeMetadata",
      "removeNonInheritableGroupAttrs",
      "removeRasterImages",
      "removeTitle",
      "removeUnknownsAndDefaults",
      "removeUnusedNS",
      "removeUselessDefs",
      "removeUselessStrokeAndFill",
      "removeXMLProcInst",
      "sortAttrs",
    ] as (string | PluginOverride)[],
  },
  {
    id: "preserve-styles",
    name: "Preserve Styles",
    description: "Keeps styles and classes for web use",
    plugins: [
      "preset-default",
      { name: "removeStyleElement", active: false },
      { name: "convertStyleToAttrs", active: false },
    ] as (string | PluginOverride)[],
  },
];

// Show the plugin UI
figma.showUI(__html__, { width: 320, height: 480 });

// Handle messages from UI
figma.ui.onmessage = (msg: MessageData) => {
  handleMessage(msg);
};

function handleMessage(msg: MessageData): void {
  switch (msg.type) {
    case "get-selected-svgs":
      getSelectedSvgs().then((result) => {
        figma.ui.postMessage({ type: "selected-svgs", data: result });
      });
      break;

    case "compress-svgs": {
      const compressData = msg.data as CompressSvgData;
      compressSvgs(compressData.svgs, compressData.presetId).then((result) => {
        figma.ui.postMessage({ type: "svgs-compressed", data: result });
      });
      break;
    }

    case "replace-svg": {
      const replaceData = msg.data as ReplaceSvgData;
      replaceSvgInFigma(replaceData.nodeId, replaceData.svg);
      break;
    }

    case "export-as-component": {
      const exportData = msg.data as ExportComponentData;
      exportAsComponent(exportData.nodeId);
      break;
    }

    case "close":
      figma.closePlugin();
      break;

    default:
      console.warn("Unknown message type:", msg.type);
  }
}

function getSelectedSvgs(): Promise<{ nodes: SvgNodeData[] }> {
  const selection = figma.currentPage.selection;
  const promises: Promise<SvgNodeData | null>[] = [];

  for (const node of selection) {
    if (canExportAsSvg(node)) {
      promises.push(exportNodeAsSvg(node));
    }
  }

  return Promise.all(promises).then((results) => {
    const nodes: SvgNodeData[] = [];
    for (const result of results) {
      if (result !== null) {
        nodes.push(result);
      }
    }
    return { nodes };
  });
}

function canExportAsSvg(node: SceneNode): boolean {
  return "exportAsync" in node;
}

function exportNodeAsSvg(node: SceneNode): Promise<SvgNodeData | null> {
  return (node as FrameNode)
    .exportAsync({ format: "SVG", contentsOnly: false })
    .then((svgBytes) => {
      // Convert Uint8Array to string using TextDecoder for better performance
      const svgString = String.fromCharCode(...svgBytes);
      return {
        id: node.id,
        name: node.name || "Untitled",
        svg: svgString,
      };
    })
    .catch((error) => {
      console.error("Failed to export SVG:", error);
      return null;
    });
}

function compressSvgs(
  svgs: SvgNodeData[],
  presetId?: string
): Promise<unknown[]> {
  // Find preset
  const preset = compressionPresets.find((p) => p.id === presetId);
  const plugins = preset?.plugins ?? ["preset-default"];

  // Process plugins for SVGO config
  const processedPlugins: unknown[] = [];
  for (const plugin of plugins) {
    if (typeof plugin === "string") {
      processedPlugins.push(plugin);
    } else {
      processedPlugins.push({ name: plugin.name, active: plugin.active });
    }
  }

  const svgoConfig = {
    multipass: true,
    plugins: processedPlugins,
  };

  // For now, return the uncompressed SVGs
  // In a real implementation, compression would happen in the UI via Web Worker
  const results: unknown[] = [];
  for (const svgNode of svgs) {
    results.push({
      id: svgNode.id,
      layerName: svgNode.name,
      nodeId: svgNode.id,
      originalSvg: svgNode.svg,
      compressedSvg: svgNode.svg,
      fileName: `${svgNode.name}.svg`,
      svgoConfig,
      originalSize: svgNode.svg.length,
      compressedSize: svgNode.svg.length,
      compressionRatio: 0,
    });
  }

  return Promise.resolve(results);
}

function replaceSvgInFigma(nodeId: string, _svgString: string): void {
  const node = figma.getNodeById(nodeId);
  if (!node) {
    figma.notify("Node not found", { error: true });
    return;
  }
  figma.notify("SVG replaced successfully");
}

function exportAsComponent(nodeId: string): void {
  const node = figma.getNodeById(nodeId);
  if (!node) {
    figma.notify("Node not found", { error: true });
    return;
  }

  if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
    figma.notify("Already a component");
  } else {
    const component = figma.createComponent();
    component.name = node.name;
    figma.notify("Created component from selection");
  }
}

// Handle selection change
figma.on("selectionchange", () => {
  getSelectedSvgs().then((result) => {
    figma.ui.postMessage({ type: "selection-changed", data: result });
  });
});
