export function EmptyState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-muted-foreground/30">
        <span className="i-hugeicons-cursor-rectangle-selection-02 text-5xl" />
      </div>
      <h3 className="mb-1 font-semibold text-base">请选择元素</h3>
      <p className="text-muted-foreground text-sm">
        Select SVG layers in Figma to optimize and export
      </p>
    </div>
  );
}
