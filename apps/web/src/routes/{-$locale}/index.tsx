import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@tiny-svg/ui/components/card";
import type { Locales } from "intlayer";
import { useCallback, useMemo } from "react";
import { useIntlayer } from "react-intlayer";
import { toast } from "sonner";
import { LocalizedLink } from "@/components/intlayer/localized-link";
import { RecentSvgs } from "@/components/recent-svgs";
import { UploadBox } from "@/components/upload-box";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop";
import { usePasteHandler } from "@/hooks/use-paste-handler";
import { useSvgHistory } from "@/hooks/use-svg-history";
import { getLatestBlogPosts } from "@/lib/blog";
import { isSvgContent, isSvgFile, readFileAsText } from "@/lib/file-utils";
import { useSvgStore } from "@/store/svg-store";

const LATEST_POSTS_COUNT = 4;

export const Route = createFileRoute("/{-$locale}/")({
  loader: async ({ params }) => {
    const latestPosts = getLatestBlogPosts(
      LATEST_POSTS_COUNT,
      params.locale as Locales,
      "desc"
    );
    return { latestPosts };
  },
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();
  const { latestPosts } = Route.useLoaderData();
  const { setOriginalSvg } = useSvgStore();
  const { hero, features, blog, messages } = useIntlayer("home");
  const { recentEntries } = useSvgHistory();

  const safeMessages = messages || {
    invalidSvgFile: "Invalid file. Please select a valid SVG file (.svg).",
    fileReadError: "Failed to read file. Please try again.",
    invalidSvgStructure: "The file does not contain valid SVG content.",
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      const content = await readFileAsText(file);
      setOriginalSvg(content, file.name);
      await navigate({ to: "/{-$locale}/optimize" });
    },
    [setOriginalSvg, navigate]
  );

  // Handle drag and drop with file validation
  const handleFileDrop = useCallback(
    async (file: File) => {
      // Validate file type
      if (!isSvgFile(file)) {
        toast.error(safeMessages.invalidSvgFile);
        return;
      }

      // Read and validate content
      try {
        const content = await readFileAsText(file);
        if (!isSvgContent(content)) {
          toast.error(safeMessages.invalidSvgStructure);
          return;
        }
        setOriginalSvg(content, file.name);
        await navigate({ to: "/{-$locale}/optimize" });
      } catch {
        toast.error(safeMessages.fileReadError);
      }
    },
    [setOriginalSvg, navigate, safeMessages]
  );

  const dragDropOptions = useMemo(
    () => ({ onFileDrop: handleFileDrop }),
    [handleFileDrop]
  );

  const isDragging = useDragAndDrop(dragDropOptions);

  usePasteHandler({
    setOriginalSvg,
    onSuccess: () => {
      navigate({ to: "/{-$locale}/optimize" });
    },
    errorMessage: messages.invalidSvgContent,
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
      <section className="mb-12 text-center md:mb-16">
        <h1 className="mb-4 font-bold text-3xl tracking-tight md:text-5xl">
          {hero.title}
        </h1>
        <p className="mb-6 text-base text-muted-foreground md:mb-8 md:text-xl">
          {hero.subtitle}
        </p>
        <div className="relative mx-auto max-w-2xl">
          <RecentSvgs
            className="-top-4 absolute left-4 z-10"
            entries={recentEntries}
          />
          <UploadBox isHighlighted={isDragging} onUpload={handleFileUpload} />
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-center font-bold text-2xl md:mb-8 md:text-3xl">
          {features.title}
        </h2>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          <Card>
            <CardHeader>
              <div className="mb-2 flex justify-center">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-3">
                  <span className="i-hugeicons-flash size-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-center">
                {features.fast.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground text-sm">
                {features.fast.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex justify-center">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-3">
                  <span className="i-hugeicons-security-lock size-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-center">
                {features.secure.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground text-sm">
                {features.secure.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex justify-center">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-3">
                  <span className="i-hugeicons-view size-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-center">
                {features.preview.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground text-sm">
                {features.preview.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section className="mt-12 md:mt-16">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <h2 className="font-bold text-2xl md:text-3xl">{blog.title}</h2>
            <LocalizedLink
              className="text-primary text-sm hover:underline md:text-base"
              to="/blog"
            >
              {blog.viewAll} →
            </LocalizedLink>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {latestPosts.map((post) => (
              <Card
                className="overflow-hidden p-0 transition-shadow hover:shadow-lg"
                key={post.slug}
              >
                <LocalizedLink
                  className="block"
                  params={{ slug: post.slug }}
                  to="/blog/$slug"
                >
                  {post.cover && (
                    <img
                      alt=""
                      className="h-48 w-full object-cover"
                      height={192}
                      src={post.cover}
                      width={800}
                    />
                  )}
                  <CardHeader className="pt-2">
                    <time className="text-muted-foreground text-sm">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <CardTitle className="mt-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-3">
                    <p className="text-muted-foreground text-sm">{post.desc}</p>
                  </CardContent>
                </LocalizedLink>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
