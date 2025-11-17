import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import appCss from "@/styles.css?url";

export type RouterAppContext = Record<string, never>;

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootDocument,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title:
          "Tiny SVG - Optimize SVGs & Convert to React, Vue, Svelte Components",
      },
      {
        name: "description",
        content:
          "Free online SVG optimizer and converter. Compress SVG files up to 70%, convert to React, Vue, and Svelte components. All processing happens in your browser - secure and fast!",
      },
      {
        name: "keywords",
        content:
          "SVG optimizer, SVG compressor, SVG to React, SVG to Vue, SVG to Svelte, minify SVG, optimize SVG online, SVG converter, web performance",
      },
      // Open Graph / Facebook
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://tiny-svg.com/",
      },
      {
        property: "og:title",
        content: "Tiny SVG - Optimize SVGs & Convert to React, Vue, Svelte",
      },
      {
        property: "og:description",
        content:
          "Free online SVG optimizer and converter. Compress SVG files up to 70%, convert to React, Vue, and Svelte components.",
      },
      {
        property: "og:image",
        content: "https://tiny-svg.com/og-image.png",
      },
      // Twitter
      {
        property: "twitter:card",
        content: "summary_large_image",
      },
      {
        property: "twitter:url",
        content: "https://tiny-svg.com/",
      },
      {
        property: "twitter:title",
        content: "Tiny SVG - Optimize SVGs & Convert to React, Vue, Svelte",
      },
      {
        property: "twitter:description",
        content:
          "Free online SVG optimizer and converter. Compress SVG files up to 70%, convert to React, Vue, and Svelte components.",
      },
      {
        property: "twitter:image",
        content: "https://tiny-svg.com/og-image.png",
      },
      // Additional SEO meta tags
      {
        name: "robots",
        content: "index, follow",
      },
      {
        name: "language",
        content: "English",
      },
      {
        name: "author",
        content: "Tiny SVG",
      },
      {
        name: "theme-color",
        content: "#3b82f6",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://tiny-svg.com/" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
});

function RootDocument() {
  // Structured Data (JSON-LD) for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tiny SVG",
    url: "https://tiny-svg.com",
    description:
      "Free online SVG optimizer and converter. Compress SVG files up to 70%, convert to React, Vue, and Svelte components.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "SVG optimization and compression",
      "Convert SVG to React components",
      "Convert SVG to Vue components",
      "Convert SVG to Svelte components",
      "Client-side processing for privacy",
      "No file upload required",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          type="application/ld+json"
        />
      </head>
      <body className="overflow-x-hidden" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
          <Toaster richColors />
          <TanStackRouterDevtools position="bottom-left" />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
