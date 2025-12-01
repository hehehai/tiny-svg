import type { TranslationFile } from "../types";

export const fr: TranslationFile = {
  common: {
    settings: "Paramètres",
    cancel: "Annuler",
    confirm: "Confirmer",
    create: "Créer",
    edit: "Modifier",
    delete: "Supprimer",
    reset: "Réinitialiser",
    save: "Enregistrer",
    close: "Fermer",
    copy: "Copier",
    download: "Télécharger",
    preview: "Aperçu",
    inherit: "Hériter",
    exporting: "Export en cours...",
    exportAll: "Tout exporter",
  },
  header: {
    svg: "SVG",
    image: "Image",
    code: "Code",
    settingsButton: "Paramètres",
  },
  settings: {
    title: "Paramètres",
    presets: "Préréglages",
    about: "À propos",
    language: "Langue",
  },
  about: {
    pluginName: "Tiny SVG",
    pluginDescription:
      "Outil puissant d'optimisation SVG et de génération de code pour Figma",
    links: "Liens",
    githubRepo: "Dépôt GitHub",
    reportIssue: "Signaler un problème",
    resetPresets: "Réinitialiser les préréglages",
    resetPresetsButton: "Réinitialiser",
    confirmResetTitle: "Confirmer la réinitialisation des préréglages",
    confirmResetDescription:
      "Cela supprimera tous les préréglages personnalisés et ne conservera que les préréglages par défaut. Cette action ne peut pas être annulée.",
    credits: "Créé avec ❤️ par l'équipe Tiny SVG",
    poweredBy: "Propulsé par SVGO",
  },
  empty: {
    title: "Veuillez sélectionner des éléments",
    description:
      "Sélectionnez des calques SVG dans Figma pour les optimiser et les exporter",
  },
  language: {
    en: "English",
    zh: "简体中文",
    ko: "한국어",
    de: "Deutsch",
    fr: "Français",
  },
  footer: {
    item: "élément",
    items: "éléments",
  },
  compression: {
    compressing: "Compression des SVG...",
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
      svgZip: "SVG ZIP exporté avec succès",
      spriteSheet: "Sprite sheet exporté avec succès",
      svgCopied: "SVG copié dans le presse-papiers",
      svgDownloaded: "SVG téléchargé",
      codeCopied: "Code copié dans le presse-papiers",
      codeDownloaded: "Code téléchargé",
      imageCopied: "{format} copié dans le presse-papiers",
      imageDownloaded: "Téléchargé en tant que {format}",
    },
    error: {
      exportFailed: "Échec de l'export",
      copySvgFailed: "Échec de la copie du SVG",
      downloadSvgFailed: "Échec du téléchargement du SVG",
      copyCodeFailed: "Échec de la copie du code",
      downloadCodeFailed: "Échec du téléchargement du code",
      copyImageFailed: "Échec de la copie de {format}",
      downloadImageFailed: "Échec du téléchargement de {format}",
      unknownFormat: "Format inconnu : {format}",
      clipboardNotSupported:
        "L'API Presse-papiers n'est pas prise en charge pour les images",
    },
  },
  preview: {
    title: "Aperçu",
    tabs: {
      view: "Vue",
      code: "Code",
    },
    toolbar: {
      hideOutline: "Masquer le contour",
      showOutline: "Afficher le contour",
      zoomOut: "Dézoomer",
      zoomIn: "Zoomer",
      resetZoom: "Réinitialiser le zoom",
      prettifyCode: "Formater le code",
      copyCode: "Copier le code",
    },
    codeView: {
      diff: "Diff",
      origin: "Original",
      optimized: "Optimisé",
    },
    messages: {
      noPreview: "Aucun SVG à prévisualiser",
      noDiff: "Aucune différence à afficher",
      noCompressed: "Aucune version compressée disponible",
      compressToSeeDiff: "Compresser le SVG pour voir la différence",
      compressToSeeOptimized: "Compresser le SVG pour voir le code optimisé",
      codePrettified: "Code formaté",
      prettifyFailed: "Échec du formatage",
      optimizedCopied: "Code optimisé copié dans le presse-papiers",
    },
    ariaLabels: {
      canvas:
        "Canvas d'aperçu SVG - utilisez la molette de la souris pour zoomer, cliquez et faites glisser pour déplacer",
      copyButton: "Copier {name}",
      downloadButton: "Télécharger {name}",
      previewButton: "Aperçu de {name}",
    },
  },
  presets: {
    empty: {
      title: "Aucun préréglage encore",
      description:
        "Créez des préréglages pour enregistrer les configurations d'optimisation couramment utilisées et les réutiliser dans plusieurs projets.",
    },
    createButton: "Créer un préréglage",
    editor: {
      createTitle: "Créer un préréglage",
      editTitle: "Modifier le préréglage",
      namePlaceholder: "Entrez le nom du préréglage",
      nameExists: "Le nom du préréglage existe déjà",
      nameRequired: "Le nom du préréglage ne peut pas être vide",
      globalSettings: "Paramètres globaux",
      multipass: "Multipasse",
      multipassDescription:
        "Répéter l'optimisation jusqu'à ce qu'aucune amélioration supplémentaire ne soit possible",
      floatPrecision: "Précision flottante",
      floatPrecisionDescription:
        "Décimales pour les coordonnées et les valeurs (0-10)",
      transformPrecision: "Précision de transformation",
      transformPrecisionDescription:
        "Décimales pour les matrices de transformation (0-10)",
      pluginsSection: "Plugins d'optimisation",
      copySuffix: "Copie",
    },
    deleteDialog: {
      title: "Confirmer la suppression du préréglage ?",
      description:
        'Le préréglage "{name}" sera définitivement supprimé et ne pourra pas être récupéré.',
      warning:
        "Les éléments utilisant ce préréglage basculeront automatiquement vers le préréglage par défaut.",
    },
    item: {
      systemBadge: "Système",
      usageTime: "Utilisé {count} fois • {time}",
      timeUnits: {
        daysAgo: "jours",
        hoursAgo: "heures",
        minutesAgo: "minutes",
        justNow: "à l'instant",
      },
      actions: {
        unpin: "Détacher",
        pin: "Épingler",
        edit: "Modifier",
        duplicate: "Dupliquer",
        delete: "Supprimer",
        cannotDeleteDefault:
          "Le préréglage par défaut ne peut pas être supprimé",
      },
    },
  },
};

export default fr;
