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
      createTitle: string;
      editTitle: string;
      namePlaceholder: string;
      nameExists: string;
      nameRequired: string;
      globalSettings: string;
      multipass: string;
      multipassDescription: string;
      floatPrecision: string;
      floatPrecisionDescription: string;
      transformPrecision: string;
      transformPrecisionDescription: string;
      pluginsSection: string;
      copySuffix: string;
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
  };
}

export type TranslationFile = TranslationKeys;
