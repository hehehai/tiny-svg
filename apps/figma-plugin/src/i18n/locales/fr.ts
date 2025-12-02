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
      copyCode: "Copier",
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
      title: {
        create: "Créer",
        edit: "Modifier",
      },
      namePlaceholder: "Entrez le nom du préréglage",
      errors: {
        duplicateName: "Le nom du préréglage existe déjà",
        emptyName: "Le nom du préréglage ne peut pas être vide",
      },
      actions: {
        save: "Enregistrer",
        delete: "Supprimer",
      },
      copySuffix: "(Copie)",
      globalSettings: {
        title: "Paramètres globaux",
        multipass: {
          label: "Multipasse",
          description:
            "Répéter l'optimisation jusqu'à ce qu'aucune amélioration supplémentaire ne soit possible",
        },
        floatPrecision: {
          label: "Précision flottante",
          description: "Décimales pour les coordonnées et les valeurs (0-10)",
        },
        transformPrecision: {
          label: "Précision de transformation",
          description: "Décimales pour les matrices de transformation (0-10)",
        },
      },
      plugins: {
        title: "Plugins d'optimisation",
      },
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
        duplicate: "Copier",
        delete: "Supprimer",
        cannotDeleteDefault:
          "Le préréglage par défaut ne peut pas être supprimé",
      },
    },
    pluginLabels: {
      removeDoctype: "Supprimer Doctype",
      removeXMLProcInst: "Supprimer les instructions de traitement XML",
      removeComments: "Supprimer les commentaires",
      removeMetadata: "Supprimer les métadonnées",
      removeXMLNS: "Supprimer l'espace de noms XML",
      removeEditorsNSData: "Supprimer les données de l'éditeur",
      cleanupAttrs: "Nettoyer les attributs",
      removeUnknownsAndDefaults:
        "Supprimer les inconnus et les valeurs par défaut",
      removeNonInheritableGroupAttrs:
        "Supprimer les attributs de groupe non héritables",
      removeUselessStrokeAndFill:
        "Supprimer les contours et remplissages inutiles",
      removeViewBox: "Supprimer ViewBox",
      cleanupEnableBackground: "Nettoyer Enable Background",
      removeEmptyAttrs: "Supprimer les attributs vides",
      removeDimensions: "Supprimer les dimensions",
      removeAttributesBySelector: "Supprimer les attributs par sélecteur",
      mergeStyles: "Fusionner les styles",
      inlineStyles: "Styles en ligne",
      minifyStyles: "Minimiser les styles",
      convertStyleToAttrs: "Convertir le style en attributs",
      removeStyleElement: "Supprimer l'élément style",
      cleanupIds: "Nettoyer les IDs",
      cleanupNumericValues: "Nettoyer les valeurs numériques",
      cleanupListOfValues: "Nettoyer les listes de valeurs",
      convertColors: "Convertir les couleurs",
      removeUselessDefs: "Supprimer les définitions inutiles",
      removeHiddenElems: "Supprimer les éléments cachés",
      removeEmptyText: "Supprimer le texte vide",
      removeEmptyContainers: "Supprimer les conteneurs vides",
      removeRasterImages: "Supprimer les images matricielles",
      removeTitle: "Supprimer le titre",
      removeDesc: "Supprimer la description",
      removeScriptElement: "Supprimer l'élément script",
      removeOffCanvasPaths: "Supprimer les chemins hors canvas",
      moveElemsAttrsToGroup: "Déplacer les attributs d'élément vers le groupe",
      moveGroupAttrsToElems:
        "Déplacer les attributs de groupe vers les éléments",
      collapseGroups: "Réduire les groupes",
      convertPathData: "Convertir les données de chemin",
      convertShapeToPath: "Convertir la forme en chemin",
      mergePaths: "Fusionner les chemins",
      reusePaths: "Réutiliser les chemins",
      convertEllipseToCircle: "Convertir l'ellipse en cercle",
      convertTransform: "Convertir la transformation",
      removeUnusedNS: "Supprimer l'espace de noms inutilisé",
      sortAttrs: "Trier les attributs",
      sortDefsChildren: "Trier les enfants de définitions",
    },
  },
};

export default fr;
