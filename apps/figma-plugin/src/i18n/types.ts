export type Locale = "en" | "zh" | "ko" | "de" | "fr";

export interface TranslationKeys {
  common: {
    settings: string;
    cancel: string;
    confirm: string;
    create: string;
    edit: string;
    delete: string;
    reset: string;
    save: string;
    close: string;
    copy: string;
    download: string;
    preview: string;
    inherit: string;
    exporting: string;
    exportAll: string;
  };
  header: {
    svg: string;
    image: string;
    code: string;
    settingsButton: string;
  };
  settings: {
    title: string;
    presets: string;
    about: string;
    language: string;
  };
  about: {
    pluginName: string;
    pluginDescription: string;
    links: string;
    githubRepo: string;
    reportIssue: string;
    resetPresets: string;
    resetPresetsButton: string;
    confirmResetTitle: string;
    confirmResetDescription: string;
    credits: string;
    poweredBy: string;
  };
  empty: {
    title: string;
    description: string;
  };
  language: {
    en: string;
    zh: string;
    ko: string;
    de: string;
    fr: string;
  };
  footer: {
    item: string;
    items: string;
  };
  compression: {
    compressing: string;
  };
  export: {
    formats: {
      zip: string;
      sprite: string;
      png: string;
      jpeg: string;
      webp: string;
      ico: string;
      reactJsx: string;
      reactTsx: string;
      vue: string;
      svelte: string;
      reactNative: string;
      flutter: string;
      dataUri: string;
      base64: string;
    };
    success: {
      svgZip: string;
      spriteSheet: string;
      svgCopied: string;
      svgDownloaded: string;
      codeCopied: string;
      codeDownloaded: string;
      imageCopied: string;
      imageDownloaded: string;
    };
    error: {
      exportFailed: string;
      copySvgFailed: string;
      downloadSvgFailed: string;
      copyCodeFailed: string;
      downloadCodeFailed: string;
      copyImageFailed: string;
      downloadImageFailed: string;
      unknownFormat: string;
      clipboardNotSupported: string;
    };
  };
  preview: {
    title: string;
    tabs: {
      view: string;
      code: string;
    };
    toolbar: {
      hideOutline: string;
      showOutline: string;
      zoomOut: string;
      zoomIn: string;
      resetZoom: string;
      prettifyCode: string;
      copyCode: string;
    };
    codeView: {
      diff: string;
      origin: string;
      optimized: string;
    };
    messages: {
      noPreview: string;
      noDiff: string;
      noCompressed: string;
      compressToSeeDiff: string;
      compressToSeeOptimized: string;
      codePrettified: string;
      prettifyFailed: string;
      optimizedCopied: string;
    };
    ariaLabels: {
      canvas: string;
      copyButton: string;
      downloadButton: string;
      previewButton: string;
    };
  };
  presets: {
    empty: {
      title: string;
      description: string;
    };
    createButton: string;
    editor: {
      title: {
        create: string;
        edit: string;
      };
      namePlaceholder: string;
      errors: {
        duplicateName: string;
        emptyName: string;
      };
      actions: {
        save: string;
        delete: string;
      };
      copySuffix: string;
      globalSettings: {
        title: string;
        multipass: {
          label: string;
          description: string;
        };
        floatPrecision: {
          label: string;
          description: string;
        };
        transformPrecision: {
          label: string;
          description: string;
        };
      };
      plugins: {
        title: string;
      };
    };
    deleteDialog: {
      title: string;
      description: string;
      warning: string;
    };
    item: {
      systemBadge: string;
      usageTime: string;
      timeUnits: {
        daysAgo: string;
        hoursAgo: string;
        minutesAgo: string;
        justNow: string;
      };
      actions: {
        unpin: string;
        pin: string;
        edit: string;
        duplicate: string;
        delete: string;
        cannotDeleteDefault: string;
      };
    };
    pluginLabels: {
      removeDoctype: string;
      removeXMLProcInst: string;
      removeComments: string;
      removeMetadata: string;
      removeXMLNS: string;
      removeEditorsNSData: string;
      cleanupAttrs: string;
      removeUnknownsAndDefaults: string;
      removeNonInheritableGroupAttrs: string;
      removeUselessStrokeAndFill: string;
      removeViewBox: string;
      cleanupEnableBackground: string;
      removeEmptyAttrs: string;
      removeDimensions: string;
      removeAttributesBySelector: string;
      mergeStyles: string;
      inlineStyles: string;
      minifyStyles: string;
      convertStyleToAttrs: string;
      removeStyleElement: string;
      cleanupIds: string;
      cleanupNumericValues: string;
      cleanupListOfValues: string;
      convertColors: string;
      removeUselessDefs: string;
      removeHiddenElems: string;
      removeEmptyText: string;
      removeEmptyContainers: string;
      removeRasterImages: string;
      removeTitle: string;
      removeDesc: string;
      removeScriptElement: string;
      removeOffCanvasPaths: string;
      moveElemsAttrsToGroup: string;
      moveGroupAttrsToElems: string;
      collapseGroups: string;
      convertPathData: string;
      convertShapeToPath: string;
      mergePaths: string;
      reusePaths: string;
      convertEllipseToCircle: string;
      convertTransform: string;
      removeUnusedNS: string;
      sortAttrs: string;
      sortDefsChildren: string;
    };
  };
}

export type TranslationFile = TranslationKeys;
