import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { validatePrefix } from "intlayer";
import { IntlayerProvider, useLocale } from "react-intlayer";
import { useI18nHTMLAttributes } from "@/hooks/use-i18n-html-attrs";
import { NotFoundComponent } from "./404";

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: async ({ params }) => {
    // Get locale from route params (not from server headers, as beforeLoad runs on both client and server)
    const localeParam = params.locale;

    // validatePrefix checks if the locale is valid according to your intlayer config
    // Returns: { isValid: boolean, localePrefix: string }
    // - isValid: true if the prefix matches a configured locale (or is empty when prefix is optional)
    // - localePrefix: the validated prefix or the default locale prefix for redirects
    const { localePrefix, isValid } = validatePrefix(localeParam);
    if (isValid) {
      return;
    }

    // Invalid locale prefix (e.g., /xyz/about where "xyz" isn't a valid locale)
    // Redirect to the 404 page with a valid locale prefix
    // This ensures the 404 page is still properly localized
    throw redirect({
      to: "/{-$locale}/404",
      params: { locale: localePrefix },
    });
  },
  component: LayoutComponent,
  notFoundComponent: NotFoundComponent,
});

function LayoutComponent() {
  useI18nHTMLAttributes();

  const { defaultLocale } = useLocale();
  const { locale } = Route.useParams();

  // 强制使用英语作为默认语言，防止服务器端渲染错误
  const safeLocale = locale ?? defaultLocale ?? "en";

  return (
    <IntlayerProvider locale={safeLocale}>
      <Outlet />
    </IntlayerProvider>
  );
}
