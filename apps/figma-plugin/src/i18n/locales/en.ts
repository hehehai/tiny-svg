import type { TranslationFile } from "../types";

export const en: TranslationFile = {
  common: {
    settings: "Settings",
    cancel: "Cancel",
    confirm: "Confirm",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    reset: "Reset",
    save: "Save",
    close: "Close",
    copy: "Copy",
    download: "Download",
    preview: "Preview",
    inherit: "Inherit",
    exporting: "Exporting...",
    exportAll: "Export All",
  },
  header: {
    svg: "SVG",
    image: "Image",
    code: "Code",
    settingsButton: "Settings",
  },
  settings: {
    title: "Settings",
    presets: "Presets",
    about: "About",
    language: "Language",
  },
  about: {
    pluginName: "Tiny SVG",
    pluginDescription:
      "Powerful SVG optimization and code generation tool for Figma",
    links: "Links",
    githubRepo: "GitHub Repository",
    reportIssue: "Report Issue",
    resetPresets: "Reset Presets",
    resetPresetsButton: "Reset",
    confirmResetTitle: "Confirm Reset Presets",
    confirmResetDescription:
      "This will delete all custom presets and keep only the default presets. This action cannot be undone.",
    credits: "Built with ❤️ by the Tiny SVG Team",
    poweredBy: "Powered by SVGO",
  },
  empty: {
    title: "Please select elements",
    description: "Select SVG layers in Figma to optimize and export",
  },
  language: {
    en: "English",
    zh: "简体中文",
    ko: "한국어",
    de: "Deutsch",
    fr: "Français",
  },
  footer: {
    item: "item",
    items: "items",
  },
  compression: {
    compressing: "Compressing SVGs...",
  },
  export: {
    formats: {
      zip: "Zip",
      sprite: "Sprite Sheet",
      png: "PNG",
      jpeg: "JPEG",
      webp: "WebP",
      ico: "ICO",
      reactJsx: "React JSX",
      reactTsx: "React TSX",
      vue: "Vue",
      svelte: "Svelte",
      reactNative: "React Native",
      flutter: "Flutter",
      dataUri: "Data URI",
      base64: "Base64",
    },
    success: {
      svgZip: "SVG ZIP exported successfully",
      spriteSheet: "Sprite sheet exported successfully",
      svgCopied: "SVG copied to clipboard",
      svgDownloaded: "SVG downloaded",
      codeCopied: "Code copied to clipboard",
      codeDownloaded: "Code downloaded",
      imageCopied: "{format} copied to clipboard",
      imageDownloaded: "Downloaded as {format}",
    },
    error: {
      exportFailed: "Failed to export",
      copySvgFailed: "Failed to copy SVG",
      downloadSvgFailed: "Failed to download SVG",
      copyCodeFailed: "Failed to copy code",
      downloadCodeFailed: "Failed to download code",
      copyImageFailed: "Failed to copy {format}",
      downloadImageFailed: "Failed to download {format}",
      unknownFormat: "Unknown format: {format}",
      clipboardNotSupported: "Clipboard API not supported for images",
    },
  },
  preview: {
    title: "Preview",
    tabs: {
      view: "View",
      code: "Code",
    },
    toolbar: {
      hideOutline: "Hide outline",
      showOutline: "Show outline",
      zoomOut: "Zoom out",
      zoomIn: "Zoom in",
      resetZoom: "Reset zoom",
      prettifyCode: "Prettify code",
      copyCode: "Copy code",
    },
    codeView: {
      diff: "Diff",
      origin: "Origin",
      optimized: "Optimized",
    },
    messages: {
      noPreview: "No SVG to preview",
      noDiff: "No diff to display",
      noCompressed: "No compressed version available",
      compressToSeeDiff: "Compress the SVG to see diff",
      compressToSeeOptimized: "Compress the SVG to see optimized code",
      codePrettified: "Code prettified",
      prettifyFailed: "Failed to prettify code",
      optimizedCopied: "Optimized code copied to clipboard",
    },
    ariaLabels: {
      canvas:
        "SVG preview canvas - use mouse wheel to zoom, click and drag to pan",
      copyButton: "Copy {name}",
      downloadButton: "Download {name}",
      previewButton: "Preview {name}",
    },
  },
  presets: {
    empty: {
      title: "No presets yet",
      description:
        "Create presets to save commonly used optimization configurations for reuse across multiple projects.",
    },
    createButton: "Create Preset",
    editor: {
      createTitle: "Create Preset",
      editTitle: "Edit Preset",
      namePlaceholder: "Enter preset name",
      nameExists: "Preset name already exists",
      nameRequired: "Preset name cannot be empty",
      globalSettings: "Global Settings",
      multipass: "Multipass",
      multipassDescription: "Repeat optimization until no further improvements",
      floatPrecision: "Float Precision",
      floatPrecisionDescription:
        "Decimal places for coordinates and values (0-10)",
      transformPrecision: "Transform Precision",
      transformPrecisionDescription:
        "Decimal places for transform matrices (0-10)",
      pluginsSection: "Optimization Plugins",
      copySuffix: "Copy",
    },
    deleteDialog: {
      title: "Confirm Delete Preset?",
      description:
        'Preset "{name}" will be permanently deleted and cannot be recovered.',
      warning:
        "Items using this preset will automatically switch to the default preset.",
    },
    item: {
      systemBadge: "System",
      usageTime: "Used {count} times • {time}",
      timeUnits: {
        daysAgo: "days ago",
        hoursAgo: "hours ago",
        minutesAgo: "minutes ago",
        justNow: "just now",
      },
      actions: {
        unpin: "Unpin",
        pin: "Pin",
        edit: "Edit",
        duplicate: "Duplicate",
        delete: "Delete",
        cannotDeleteDefault: "Default preset cannot be deleted",
      },
    },
  },
};

export default en;
