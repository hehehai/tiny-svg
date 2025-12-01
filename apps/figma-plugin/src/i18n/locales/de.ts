import type { TranslationFile } from "../types";

export const de: TranslationFile = {
  common: {
    settings: "Einstellungen",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    create: "Erstellen",
    edit: "Bearbeiten",
    delete: "Löschen",
    reset: "Zurücksetzen",
    save: "Speichern",
    close: "Schließen",
    copy: "Kopieren",
    download: "Herunterladen",
    preview: "Vorschau",
    inherit: "Erben",
    exporting: "Exportiere...",
    exportAll: "Alle exportieren",
  },
  header: {
    svg: "SVG",
    image: "Bild",
    code: "Code",
    settingsButton: "Einstellungen",
  },
  settings: {
    title: "Einstellungen",
    presets: "Voreinstellungen",
    about: "Über",
    language: "Sprache",
  },
  about: {
    pluginName: "Tiny SVG",
    pluginDescription:
      "Leistungsstarkes SVG-Optimierungs- und Code-Generierungs-Tool für Figma",
    links: "Links",
    githubRepo: "GitHub-Repository",
    reportIssue: "Problem melden",
    resetPresets: "Voreinstellungen zurücksetzen",
    resetPresetsButton: "Zurücksetzen",
    confirmResetTitle: "Zurücksetzen der Voreinstellungen bestätigen",
    confirmResetDescription:
      "Dadurch werden alle benutzerdefinierten Voreinstellungen gelöscht und nur die Standard-Voreinstellungen beibehalten. Diese Aktion kann nicht rückgängig gemacht werden.",
    credits: "Mit ❤️ vom Tiny SVG Team erstellt",
    poweredBy: "Unterstützt von SVGO",
  },
  empty: {
    title: "Bitte Elemente auswählen",
    description:
      "Wählen Sie SVG-Ebenen in Figma aus, um sie zu optimieren und zu exportieren",
  },
  language: {
    en: "English",
    zh: "简体中文",
    ko: "한국어",
    de: "Deutsch",
    fr: "Français",
  },
  footer: {
    item: "Element",
    items: "Elemente",
  },
  compression: {
    compressing: "SVGs werden komprimiert...",
  },
  export: {
    formats: {
      zip: "Zip",
      sprite: "Sprite-Sheet",
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
      svgZip: "SVG-ZIP erfolgreich exportiert",
      spriteSheet: "Sprite-Sheet erfolgreich exportiert",
      svgCopied: "SVG in Zwischenablage kopiert",
      svgDownloaded: "SVG heruntergeladen",
      codeCopied: "Code in Zwischenablage kopiert",
      codeDownloaded: "Code heruntergeladen",
      imageCopied: "{format} in Zwischenablage kopiert",
      imageDownloaded: "Als {format} heruntergeladen",
    },
    error: {
      exportFailed: "Export fehlgeschlagen",
      copySvgFailed: "SVG kopieren fehlgeschlagen",
      downloadSvgFailed: "SVG herunterladen fehlgeschlagen",
      copyCodeFailed: "Code kopieren fehlgeschlagen",
      downloadCodeFailed: "Code herunterladen fehlgeschlagen",
      copyImageFailed: "{format} kopieren fehlgeschlagen",
      downloadImageFailed: "{format} herunterladen fehlgeschlagen",
      unknownFormat: "Unbekanntes Format: {format}",
      clipboardNotSupported:
        "Zwischenablage-API wird für Bilder nicht unterstützt",
    },
  },
  preview: {
    title: "Vorschau",
    tabs: {
      view: "Ansicht",
      code: "Code",
    },
    toolbar: {
      hideOutline: "Umriss ausblenden",
      showOutline: "Umriss anzeigen",
      zoomOut: "Verkleinern",
      zoomIn: "Vergrößern",
      resetZoom: "Zoom zurücksetzen",
      prettifyCode: "Code formatieren",
      copyCode: "Code kopieren",
    },
    codeView: {
      diff: "Diff",
      origin: "Original",
      optimized: "Optimiert",
    },
    messages: {
      noPreview: "Kein SVG zur Vorschau",
      noDiff: "Kein Diff anzuzeigen",
      noCompressed: "Keine komprimierte Version verfügbar",
      compressToSeeDiff: "SVG komprimieren, um Diff zu sehen",
      compressToSeeOptimized: "SVG komprimieren, um optimierten Code zu sehen",
      codePrettified: "Code formatiert",
      prettifyFailed: "Formatierung fehlgeschlagen",
      optimizedCopied: "Optimierter Code in Zwischenablage kopiert",
    },
    ariaLabels: {
      canvas:
        "SVG-Vorschau-Canvas - Mausrad zum Zoomen verwenden, klicken und ziehen zum Verschieben",
      copyButton: "{name} kopieren",
      downloadButton: "{name} herunterladen",
      previewButton: "{name} Vorschau",
    },
  },
  presets: {
    empty: {
      title: "Noch keine Voreinstellungen",
      description:
        "Erstellen Sie Voreinstellungen, um häufig verwendete Optimierungskonfigurationen zu speichern und projektübergreifend wiederzuverwenden.",
    },
    createButton: "Voreinstellung erstellen",
    editor: {
      createTitle: "Voreinstellung erstellen",
      editTitle: "Voreinstellung bearbeiten",
      namePlaceholder: "Voreinstellungsname eingeben",
      nameExists: "Voreinstellungsname existiert bereits",
      nameRequired: "Voreinstellungsname darf nicht leer sein",
      globalSettings: "Globale Einstellungen",
      multipass: "Mehrfachdurchlauf",
      multipassDescription:
        "Optimierung wiederholen, bis keine weiteren Verbesserungen möglich sind",
      floatPrecision: "Gleitkomma-Präzision",
      floatPrecisionDescription:
        "Dezimalstellen für Koordinaten und Werte (0-10)",
      transformPrecision: "Transformations-Präzision",
      transformPrecisionDescription:
        "Dezimalstellen für Transformationsmatrizen (0-10)",
      pluginsSection: "Optimierungs-Plugins",
      copySuffix: "Kopie",
    },
    deleteDialog: {
      title: "Voreinstellung löschen bestätigen?",
      description:
        'Voreinstellung "{name}" wird dauerhaft gelöscht und kann nicht wiederhergestellt werden.',
      warning:
        "Elemente, die diese Voreinstellung verwenden, werden automatisch auf die Standard-Voreinstellung umgestellt.",
    },
    item: {
      systemBadge: "System",
      usageTime: "{count} Mal verwendet • {time}",
      timeUnits: {
        daysAgo: "Tage her",
        hoursAgo: "Stunden her",
        minutesAgo: "Minuten her",
        justNow: "gerade eben",
      },
      actions: {
        unpin: "Lösen",
        pin: "Anheften",
        edit: "Bearbeiten",
        duplicate: "Duplizieren",
        delete: "Löschen",
        cannotDeleteDefault:
          "Standard-Voreinstellung kann nicht gelöscht werden",
      },
    },
  },
};

export default de;
