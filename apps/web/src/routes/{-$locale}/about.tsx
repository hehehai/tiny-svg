import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";

export const Route = createFileRoute("/{-$locale}/about")({
  component: AboutComponent,
});

const DEPENDENCY_LINKS = [
  { href: "https://github.com/svg/svgo", key: "svgo" },
  { href: "https://tanstack.com/router", key: "router" },
  { href: "https://tanstack.com/start", key: "start" },
  { href: "https://react.dev", key: "react" },
  { href: "https://intlayer.org", key: "intlayer" },
  { href: "https://www.radix-ui.com", key: "radix" },
  { href: "https://github.com/wooorm/refractor", key: "refractor" },
  { href: "https://prettier.io", key: "prettier" },
  { href: "https://tailwindcss.com", key: "tailwind" },
  { href: "https://biomejs.dev", key: "biome" },
  { href: "https://vite.dev", key: "vite" },
] as const;

function AboutComponent() {
  const {
    title,
    whatIsSection,
    featuresSection,
    figmaPluginSection,
    authorSection,
    dependenciesSection,
    openSourceSection,
  } = useIntlayer("about");

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-5xl tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-xl">
          {whatIsSection.description}
        </p>
      </div>

      <div className="space-y-16">
        {/* Features Section */}
        <section
          aria-labelledby="features-heading"
          className="rounded-lg border bg-card p-8"
        >
          <h2 className="mb-6 font-semibold text-3xl" id="features-heading">
            {featuresSection.title}
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            <li className="flex items-center gap-3">
              <span className="i-hugeicons-tick-02 size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                {featuresSection.items.compression}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="i-hugeicons-tick-02 size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                {featuresSection.items.preview}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="i-hugeicons-tick-02 size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                {featuresSection.items.customizable}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="i-hugeicons-tick-02 size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                {featuresSection.items.noServer}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="i-hugeicons-tick-02 size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                {featuresSection.items.dragDrop}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="i-hugeicons-tick-02 size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                {featuresSection.items.codeDiff}
              </span>
            </li>
          </ul>
        </section>

        {/* Figma Plugin Section */}
        <section
          aria-labelledby="figma-heading"
          className="rounded-lg border bg-linear-to-br from-card to-muted/20 p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="i-hugeicons-figma size-8 text-[#F24E1E]" />
            <h2 className="font-semibold text-3xl" id="figma-heading">
              {figmaPluginSection.title}
            </h2>
          </div>
          <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
            {figmaPluginSection.description}
          </p>

          {/* Plugin Screenshot */}
          <div className="mb-8 overflow-hidden rounded-lg border bg-background shadow-lg">
            <img
              alt="Figma Plugin Screenshots"
              className="w-full"
              height={904}
              src="https://raw.githubusercontent.com/hehehai/tiny-svg/main/docs/images/figma-plugin.webp"
              width={1920}
            />
          </div>

          {/* Features Grid */}
          <ul className="mb-8 grid gap-3 md:grid-cols-2">
            <li className="flex items-center gap-3 rounded-md bg-background/50 p-3">
              <span className="i-hugeicons-layers-02 size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground text-sm">
                {figmaPluginSection.features.batch}
              </span>
            </li>
            <li className="flex items-center gap-3 rounded-md bg-background/50 p-3">
              <span className="i-hugeicons-view size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground text-sm">
                {figmaPluginSection.features.realtime}
              </span>
            </li>
            <li className="flex items-center gap-3 rounded-md bg-background/50 p-3">
              <span className="i-hugeicons-settings-02 size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground text-sm">
                {figmaPluginSection.features.presets}
              </span>
            </li>
            <li className="flex items-center gap-3 rounded-md bg-background/50 p-3">
              <span className="i-hugeicons-refresh size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground text-sm">
                {figmaPluginSection.features.replace}
              </span>
            </li>
            <li className="flex items-center gap-3 rounded-md bg-background/50 p-3 md:col-span-2">
              <span className="i-hugeicons-code size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground text-sm">
                {figmaPluginSection.features.codeExport}
              </span>
            </li>
          </ul>

          {/* Install Button */}
          <a
            className="inline-flex items-center gap-2 rounded-lg bg-[#F24E1E] px-6 py-3 font-medium text-white transition-colors hover:bg-[#D83B0F]"
            href="https://www.figma.com/community/plugin/1577284420062305768"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="i-hugeicons-figma size-5" />
            {figmaPluginSection.installButton}
          </a>
        </section>

        {/* Built With Section */}
        <section
          aria-labelledby="dependencies-heading"
          className="rounded-lg border bg-card p-8"
        >
          <h2 className="mb-6 font-semibold text-3xl" id="dependencies-heading">
            {dependenciesSection.title}
          </h2>
          <p className="mb-6 text-muted-foreground">
            {dependenciesSection.description}
          </p>
          <nav
            aria-label="Project dependencies"
            className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
          >
            {DEPENDENCY_LINKS.map(({ href, key }) => (
              <a
                className="flex items-center gap-2 rounded-md border bg-background/50 p-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                href={href}
                key={key}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="i-hugeicons-link-03 size-4 text-muted-foreground" />
                <span>{dependenciesSection.libraries[key]}</span>
              </a>
            ))}
          </nav>
        </section>

        {/* Author & Open Source */}
        <div className="grid gap-8 md:grid-cols-2">
          <section
            aria-labelledby="author-heading"
            className="rounded-lg border bg-card p-8"
          >
            <h2 className="mb-4 font-semibold text-2xl" id="author-heading">
              {authorSection.title}
            </h2>
            <p className="text-muted-foreground">
              {authorSection.createdBy}{" "}
              <a
                className="font-medium text-primary hover:underline"
                href="https://hehehai.cn"
                rel="noopener noreferrer"
                target="_blank"
              >
                hehehai
              </a>
            </p>
          </section>

          <section
            aria-labelledby="opensource-heading"
            className="rounded-lg border bg-card p-8"
          >
            <h2 className="mb-4 font-semibold text-2xl" id="opensource-heading">
              {openSourceSection.title}
            </h2>
            <p className="mb-4 text-muted-foreground text-sm">
              {openSourceSection.description}
            </p>
            <a
              className="inline-flex items-center gap-2 text-primary hover:underline"
              href="https://github.com/hehehai/tiny-svg"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span aria-hidden="true" className="i-hugeicons-github size-5" />
              {openSourceSection.viewOnGitHub}
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
