// SEO Configuration and Utilities

export const siteConfig = {
  name: "Tiny SVG",
  url: "https://tiny-svg.actnow.dev",
  title: "Tiny SVG - Optimize SVGs & Convert to React, Vue, Svelte Components",
  description:
    "Free online SVG optimizer and converter. Compress SVG files up to 70%, convert to React, Vue, and Svelte components. All processing happens in your browser - secure and fast!",
  keywords: [
    "SVG optimizer",
    "SVG compressor",
    "SVG to React",
    "SVG to Vue",
    "SVG to Svelte",
    "minify SVG",
    "optimize SVG online",
    "SVG converter",
    "web performance",
  ],
  ogImage: "https://tiny-svg.actnow.dev/og-image.png",
  author: "Tiny SVG Team",
  social: {
    twitter: "@tinysvg",
  },
};

export function generateMetaTags({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
}) {
  const finalTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const finalDescription = description || siteConfig.description;
  const finalImage = image || siteConfig.ogImage;
  const finalUrl = url || siteConfig.url;

  return [
    { title: finalTitle },
    { name: "description", content: finalDescription },
    // Open Graph
    { property: "og:type", content: type },
    { property: "og:url", content: finalUrl },
    { property: "og:title", content: finalTitle },
    { property: "og:description", content: finalDescription },
    { property: "og:image", content: finalImage },
    ...(publishedTime
      ? [{ property: "article:published_time", content: publishedTime }]
      : []),
    // Twitter
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:url", content: finalUrl },
    { property: "twitter:title", content: finalTitle },
    { property: "twitter:description", content: finalDescription },
    { property: "twitter:image", content: finalImage },
  ];
}

export function generateCanonicalLink(url: string) {
  return { rel: "canonical", href: url };
}

export function generateBlogPostStructuredData({
  title,
  description,
  image,
  slug,
  publishedTime,
}: {
  title: string;
  description: string;
  image?: string;
  slug: string;
  publishedTime: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: image || siteConfig.ogImage,
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: {
      "@type": "Organization",
      name: siteConfig.author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`,
    },
  };
}
