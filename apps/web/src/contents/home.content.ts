import { type Dictionary, t } from "intlayer";

const homeContent = {
  key: "home",
  content: {
    hero: {
      title: t({
        en: "Optimize Your SVG Files",
        zh: "优化您的 SVG 文件",
        ko: "SVG 파일 최적화",
        de: "Optimieren Sie Ihre SVG-Dateien",
        fr: "Optimisez vos fichiers SVG",
      }),
      subtitle: t({
        en: "Fast, secure, and client-side SVG compression with real-time preview",
        zh: "快速、安全的客户端 SVG 压缩，实时预览",
        ko: "빠르고 안전한 클라이언트 측 SVG 압축 및 실시간 미리보기",
        de: "Schnelle, sichere clientseitige SVG-Komprimierung mit Echtzeitvorschau",
        fr: "Compression SVG rapide, sécurisée et côté client avec aperçu en temps réel",
      }),
    },
    features: {
      title: t({
        en: "Features",
        zh: "功能特性",
        ko: "기능",
        de: "Funktionen",
        fr: "Fonctionnalités",
      }),
      fast: {
        title: t({
          en: "Lightning Fast",
          zh: "极速处理",
          ko: "초고속",
          de: "Blitzschnell",
          fr: "Ultra rapide",
        }),
        description: t({
          en: "Optimize your SVG files in milliseconds with powerful SVGO engine running entirely in your browser",
          zh: "使用强大的 SVGO 引擎在浏览器中以毫秒级速度优化您的 SVG 文件",
          ko: "브라우저에서 완전히 실행되는 강력한 SVGO 엔진으로 밀리초 단위로 SVG 파일을 최적화하세요",
          de: "Optimieren Sie Ihre SVG-Dateien in Millisekunden mit der leistungsstarken SVGO-Engine, die vollständig in Ihrem Browser läuft",
          fr: "Optimisez vos fichiers SVG en quelques millisecondes grâce au puissant moteur SVGO qui s'exécute entièrement dans votre navigateur",
        }),
      },
      secure: {
        title: t({
          en: "100% Secure",
          zh: "100% 安全",
          ko: "100% 안전",
          de: "100% Sicher",
          fr: "100% Sécurisé",
        }),
        description: t({
          en: "No server uploads required. All processing happens locally in your browser, keeping your files private",
          zh: "无需上传到服务器。所有处理都在您的浏览器本地进行，保护您的文件隐私",
          ko: "서버 업로드가 필요 없습니다. 모든 처리는 브라우저 내에서 로컬로 이루어져 파일의 개인정보를 보호합니다",
          de: "Keine Server-Uploads erforderlich. Die gesamte Verarbeitung erfolgt lokal in Ihrem Browser und schützt Ihre Dateien",
          fr: "Aucun serveur requis. Tout le traitement se fait localement dans votre navigateur, gardant vos fichiers privés",
        }),
      },
      preview: {
        title: t({
          en: "Real-time Preview",
          zh: "实时预览",
          ko: "실시간 미리보기",
          de: "Echtzeitvorschau",
          fr: "Aperçu en temps réel",
        }),
        description: t({
          en: "See the results instantly with side-by-side comparison and code diff viewer",
          zh: "通过并排比较和代码差异查看器即时查看结果",
          ko: "나란히 비교 및 코드 차이 뷰어로 즉시 결과 확인",
          de: "Sehen Sie die Ergebnisse sofort mit Seite-an-Seite-Vergleich und Code-Diff-Viewer",
          fr: "Voyez les résultats instantanément avec une comparaison côte à côte et un visualiseur de différences de code",
        }),
      },
    },
    blog: {
      title: t({
        en: "Latest Blog Posts",
        zh: "最新博客文章",
        ko: "최신 블로그 게시물",
        de: "Neueste Blogbeiträge",
        fr: "Derniers articles du blog",
      }),
      viewAll: t({
        en: "View all",
        zh: "查看全部",
        ko: "모두 보기",
        de: "Alle anzeigen",
        fr: "Voir tout",
      }),
    },
    upload: {
      dragActive: t({
        en: "Drop your SVG file here",
        zh: "将您的 SVG 文件拖放到这里",
        ko: "SVG 파일을 여기에 놓으세요",
        de: "Lassen Sie Ihre SVG-Datei hier fallen",
        fr: "Déposez votre fichier SVG ici",
      }),
      dragInactive: t({
        en: "Drag & drop your SVG file here",
        zh: "将您的 SVG 文件拖放到这里",
        ko: "SVG 파일을 여기에 끌어다 놓으세요",
        de: "Ziehen Sie Ihre SVG-Datei hierher",
        fr: "Glissez-déposez votre fichier SVG ici",
      }),
      clickToBrowse: t({
        en: "or click to browse files",
        zh: "或点击浏览文件",
        ko: "또는 클릭하여 파일 찾기",
        de: "oder klicken Sie, um Dateien zu durchsuchen",
        fr: "ou cliquez pour parcourir les fichiers",
      }),
      pasteHint: t({
        en: "You can also paste SVG code or base64 directly (Ctrl+V / Cmd+V)",
        zh: "您也可以直接粘贴 SVG 代码或 base64 (Ctrl+V / Cmd+V)",
        ko: "SVG 코드 또는 base64를 직접 붙여넣을 수도 있습니다 (Ctrl+V / Cmd+V)",
        de: "Sie können auch SVG-Code oder base64 direkt einfügen (Strg+V / Cmd+V)",
        fr: "Vous pouvez aussi coller du code SVG ou base64 directement (Ctrl+V / Cmd+V)",
      }),
      acceptsOnly: t({
        en: "Accepts .svg files only",
        zh: "仅接受 .svg 文件",
        ko: ".svg 파일만 허용됩니다",
        de: "Akzeptiert nur .svg-Dateien",
        fr: "Accepte uniquement les fichiers .svg",
      }),
    },
    messages: {
      invalidSvgContent: t({
        en: "Invalid SVG content. Please paste valid SVG code.",
        zh: "无效的 SVG 内容。请粘贴有效的 SVG 代码。",
        ko: "유효하지 않은 SVG 내용입니다. 유효한 SVG 코드를 붙여넣어주세요.",
        de: "Ungültiger SVG-Inhalt. Bitte fügen Sie gültigen SVG-Code ein.",
        fr: "Contenu SVG invalide. Veuillez coller un code SVG valide.",
      }),
      invalidSvgFile: t({
        en: "Invalid file. Please select a valid SVG file (.svg).",
        zh: "无效的文件。请选择有效的 SVG 文件 (.svg)。",
        ko: "유효하지 않은 파일입니다. 유효한 SVG 파일(.svg)을 선택해주세요.",
        de: "Ungültige Datei. Bitte wählen Sie eine gültige SVG-Datei (.svg).",
        fr: "Fichier invalide. Veuillez sélectionner un fichier SVG valide (.svg).",
      }),
      fileReadError: t({
        en: "Failed to read file. Please try again.",
        zh: "读取文件失败。请重试。",
        ko: "파일을 읽는 데 실패했습니다. 다시 시도해주세요.",
        de: "Datei konnte nicht gelesen werden. Bitte versuchen Sie es erneut.",
        fr: "Échec de la lecture du fichier. Veuillez réessayer.",
      }),
      invalidSvgStructure: t({
        en: "The file does not contain valid SVG content.",
        zh: "该文件不包含有效的 SVG 内容。",
        ko: "파일에 유효한 SVG 내용이 없습니다.",
        de: "Die Datei enthält keinen gültigen SVG-Inhalt.",
        fr: "Le fichier ne contient pas de contenu SVG valide.",
      }),
      uploadSuccess: t({
        en: "SVG uploaded successfully!",
        zh: "SVG 上传成功！",
        ko: "SVG가 성공적으로 업로드되었습니다!",
        de: "SVG erfolgreich hochgeladen!",
        fr: "SVG téléchargé avec succès !",
      }),
    },
  },
} satisfies Dictionary;

export default homeContent;
