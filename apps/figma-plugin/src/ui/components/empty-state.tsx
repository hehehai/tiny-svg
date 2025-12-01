import { useTranslation } from "@/i18n/hooks";

export function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-muted-foreground/30">
        <span className="i-hugeicons-cursor-rectangle-selection-02 text-5xl" />
      </div>
      <h3 className="mb-1 font-semibold text-base">{t("empty.title")}</h3>
      <p className="text-muted-foreground text-sm">{t("empty.description")}</p>
    </div>
  );
}
