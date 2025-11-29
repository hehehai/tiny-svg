// SVGO Plugin Labels - Chinese translations
export const PLUGIN_LABELS: Record<string, string> = {
  // Document cleanup
  removeDoctype: "移除 Doctype",
  removeXMLProcInst: "移除 XML 处理指令",
  removeComments: "移除注释",
  removeMetadata: "移除元数据",
  removeXMLNS: "移除 XML 命名空间",
  removeEditorsNSData: "移除编辑器数据",

  // Attributes
  cleanupAttrs: "清理属性",
  removeUnknownsAndDefaults: "移除未知和默认值",
  removeNonInheritableGroupAttrs: "移除非继承组属性",
  removeUselessStrokeAndFill: "移除无用的描边和填充",
  removeViewBox: "移除 ViewBox",
  cleanupEnableBackground: "清理启用背景",
  removeEmptyAttrs: "移除空属性",
  removeDimensions: "移除尺寸",
  removeAttributesBySelector: "按选择器移除属性",

  // Styles
  mergeStyles: "合并样式",
  inlineStyles: "内联样式",
  minifyStyles: "压缩样式",
  convertStyleToAttrs: "样式转属性",
  removeStyleElement: "移除样式元素",

  // IDs and classes
  cleanupIds: "清理 ID",

  // Numbers and values
  cleanupNumericValues: "清理数值",
  cleanupListOfValues: "清理值列表",
  convertColors: "转换颜色",

  // Elements
  removeUselessDefs: "移除无用定义",
  removeHiddenElems: "移除隐藏元素",
  removeEmptyText: "移除空文本",
  removeEmptyContainers: "移除空容器",
  removeRasterImages: "移除栅格图像",
  removeTitle: "移除标题",
  removeDesc: "移除描述",
  removeScriptElement: "移除脚本元素",
  removeOffCanvasPaths: "移除画布外路径",

  // Groups
  moveElemsAttrsToGroup: "移动元素属性到组",
  moveGroupAttrsToElems: "移动组属性到元素",
  collapseGroups: "折叠组",

  // Paths
  convertPathData: "转换路径数据",
  convertShapeToPath: "形状转路径",
  mergePaths: "合并路径",
  reusePaths: "复用路径",

  // Shapes
  convertEllipseToCircle: "椭圆转圆形",

  // Transforms
  convertTransform: "转换变换",

  // Namespace
  removeUnusedNS: "移除未使用命名空间",

  // Sorting
  sortAttrs: "排序属性",
  sortDefsChildren: "排序定义子元素",
};

export function getPluginLabel(name: string): string {
  return PLUGIN_LABELS[name] || name;
}

export function getAllPluginLabels(): Array<{ name: string; label: string }> {
  return Object.entries(PLUGIN_LABELS).map(([name, label]) => ({
    name,
    label,
  }));
}
