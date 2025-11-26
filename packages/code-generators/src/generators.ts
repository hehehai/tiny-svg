import type { CodeGeneratorOptions, GenerationResult } from "./types.js";

// Top-level regex constants for performance
const SVG_PROPS_REGEX = /<svg([^>]*)>/;
const SVG_RN_PROPS_REGEX = /<Svg([^>]*)>/;

export function generateDataUri(
  svg: string,
  _options: CodeGeneratorOptions
): GenerationResult {
  const optimizedSvg = optimizeSvgForDataUri(svg);
  const base64 = btoa(optimizedSvg);
  const dataUri = `data:image/svg+xml;base64,${base64}`;

  return {
    code: dataUri,
    language: "text",
    filename: "data-uri.txt",
    size: dataUri.length,
  };
}

export function generateReactCode(
  svg: string,
  options: CodeGeneratorOptions
): GenerationResult {
  const componentName = options.componentName || "SvgIcon";
  const tsx = options.typescript !== false;
  const extension = tsx ? "tsx" : "jsx";

  // Clean SVG for React
  const cleanSvg = cleanSvgForReact(svg);

  // Convert to JSX
  const jsx = convertSvgToJsx(cleanSvg);

  const template = tsx ? generateReactTsxTemplate : generateReactJsxTemplate;
  const code = template(jsx, componentName);

  return {
    code,
    language: tsx ? "typescript" : "javascript",
    filename: `${componentName}.${extension}`,
    size: code.length,
  };
}

export function generateVueCode(
  svg: string,
  options: CodeGeneratorOptions
): GenerationResult {
  const componentName = options.componentName || "SvgIcon";
  const ts = options.typescript;
  const extension = ts ? "vue" : "vue";

  // Clean SVG for Vue
  const cleanSvg = cleanSvgForVue(svg);

  const template = ts ? generateVueTsTemplate : generateVueTemplate;
  const code = template(cleanSvg, componentName);

  return {
    code,
    language: ts ? "typescript" : "javascript",
    filename: `${componentName}.${extension}`,
    size: code.length,
  };
}

export function generateSvelteCode(
  svg: string,
  options: CodeGeneratorOptions
): GenerationResult {
  const componentName = options.componentName || "SvgIcon";
  const ts = options.typescript;
  const extension = ts ? "svelte" : "svelte";

  // Clean SVG for Svelte
  const cleanSvg = cleanSvgForSvelte(svg);

  const template = ts ? generateSvelteTsTemplate : generateSvelteTemplate;
  const code = template(cleanSvg, componentName);

  return {
    code,
    language: ts ? "typescript" : "javascript",
    filename: `${componentName}.${extension}`,
    size: code.length,
  };
}

export function generateReactNativeCode(
  svg: string,
  options: CodeGeneratorOptions
): GenerationResult {
  const componentName = options.componentName || "SvgIcon";
  const ts = options.typescript;
  const extension = ts ? "tsx" : "jsx";

  // Convert to React Native SVG format
  const reactNativeSvg = convertToReactNativeSvg(svg);

  const template = ts
    ? generateReactNativeTsxTemplate
    : generateReactNativeJsxTemplate;
  const code = template(reactNativeSvg, componentName);

  return {
    code,
    language: ts ? "typescript" : "javascript",
    filename: `${componentName}.${extension}`,
    size: code.length,
  };
}

export function generateFlutterCode(
  svg: string,
  options: CodeGeneratorOptions
): GenerationResult {
  const className = options.componentName || "SvgIcon";

  // Convert to Flutter widget format
  const flutterWidget = convertToFlutterWidget(svg);

  const code = generateFlutterTemplate(flutterWidget, className);

  return {
    code,
    language: "dart",
    filename: `${className}.dart`,
    size: code.length,
  };
}

// Helper functions
function optimizeSvgForDataUri(svg: string): string {
  return svg
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .replace(/\n/g, "")
    .trim();
}

function cleanSvgForReact(svg: string): string {
  return svg
    .replace(/class=/g, "className=")
    .replace(/for=/g, "htmlFor=")
    .replace(/(?:xlink:?href|href)=/g, "href=")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function cleanSvgForVue(svg: string): string {
  return svg.replace(/(?:xlink:?href|href)=/g, ":href=");
}

function cleanSvgForSvelte(svg: string): string {
  return svg.replace(/(?:xlink:?href|href)=/g, "href=");
}

function convertSvgToJsx(svg: string): string {
  return svg
    .replace(/(\w+)=(?:")([^"]*)(?:")/g, '$1="{$2}"')
    .replace(/(\w+)=(?:')([^']*)(?:')/g, "$1='{$2}'");
}

function convertToReactNativeSvg(svg: string): string {
  return svg
    .replace(/<svg/g, "<Svg")
    .replace(/<\/svg/g, "</Svg")
    .replace(/<circle/g, "<Circle")
    .replace(/<\/circle/g, "</Circle")
    .replace(/<rect/g, "<Rect")
    .replace(/<\/rect/g, "</Rect")
    .replace(/<path/g, "<Path")
    .replace(/<\/path/g, "</Path")
    .replace(/<line/g, "<Line")
    .replace(/<\/line/g, "</Line")
    .replace(/<ellipse/g, "<Ellipse")
    .replace(/<\/ellipse/g, "</Ellipse")
    .replace(/<polygon/g, "<Polygon")
    .replace(/<\/polygon/g, "</Polygon")
    .replace(/<polyline/g, "<Polyline")
    .replace(/<\/polyline/g, "</Polyline")
    .replace(/class=/g, "className=");
}

function convertToFlutterWidget(svg: string): string {
  // This is a simplified conversion - in practice you'd need a proper SVG to Flutter converter
  return `// Convert this SVG to Flutter using flutter_svg package\n// SVG: ${svg.substring(0, 100)}...`;
}

// Template generators
function generateReactJsxTemplate(jsx: string, componentName: string): string {
  return `import React from 'react';

export const ${componentName} = (props) => (
  ${jsx.replace(SVG_PROPS_REGEX, "<svg$1{...props}>")}
);

export default ${componentName};`;
}

function generateReactTsxTemplate(jsx: string, componentName: string): string {
  return `import React from 'react';
import type { SVGProps } from 'react';

interface ${componentName}Props extends SVGProps<SVGSVGElement> {}

export const ${componentName}: React.FC<${componentName}Props> = (props) => (
  ${jsx.replace(SVG_PROPS_REGEX, "<svg$1{...props}>")}
);

export default ${componentName};`;
}

function generateVueTemplate(svg: string, componentName: string): string {
  return `<template>
  ${svg}
</template>

<script>
export default {
  name: '${componentName}'
};
</script>`;
}

function generateVueTsTemplate(svg: string, componentName: string): string {
  return `<template>
  ${svg}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: '${componentName}'
});
</script>`;
}

function generateSvelteTemplate(svg: string, componentName: string): string {
  return `<!-- ${componentName}.svelte -->
${svg}

<script>
  export let props = {};
</script>`;
}

function generateSvelteTsTemplate(svg: string, componentName: string): string {
  return `<!-- ${componentName}.svelte -->
${svg}

<script lang="ts">
  export let props: Record<string, any> = {};
</script>`;
}

function generateReactNativeJsxTemplate(
  jsx: string,
  componentName: string
): string {
  return `import React from 'react';
import { Svg, Circle, Rect, Path, etc } from 'react-native-svg';

export const ${componentName} = (props) => (
  ${jsx.replace(SVG_RN_PROPS_REGEX, "<Svg$1{...props}>")}
);

export default ${componentName};`;
}

function generateReactNativeTsxTemplate(
  jsx: string,
  componentName: string
): string {
  return `import React from 'react';
import { Svg, Circle, Rect, Path, etc } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

interface ${componentName}Props extends SvgProps {}

export const ${componentName}: React.FC<${componentName}Props> = (props) => (
  ${jsx.replace(SVG_RN_PROPS_REGEX, "<Svg$1{...props}>")}
);

export default ${componentName};`;
}

function generateFlutterTemplate(widget: string, className: string): string {
  return `import 'package:flutter_svg/flutter_svg.dart';

class ${className} extends StatelessWidget {
  final double? width;
  final double? height;
  final Color? color;

  const ${className}({
    Key? key,
    this.width,
    this.height,
    this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SvgPicture.string(
      '''${widget}''',
      width: width,
      height: height,
      color: color,
    );
  }
}`;
}
