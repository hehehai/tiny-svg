import {
  CollapsibleCard,
  CollapsibleCardContent,
  CollapsibleCardHeader,
  CollapsibleCardTitle,
} from "@/components/ui/collapsible-card";
import { Diff, Hunk } from "@/components/ui/diff";

import { type ParseOptions, parseDiff } from "@/components/ui/diff/utils/parse";

export function DiffViewer({
  patch,
  options = {},
}: {
  patch: string;
  options?: Partial<ParseOptions>;
}) {
  const [file] = parseDiff(patch, options);

  if (!file) {
    return (
      <div className="flex items-center justify-center p-4 text-muted-foreground">
        No diff to display
      </div>
    );
  }

  return (
    <CollapsibleCard
      className="my-4 w-full text-[0.8rem]"
      data-section-id="diff-viewer"
      defaultOpen
      id="diff-viewer"
      title="File Changes"
    >
      <CollapsibleCardHeader>
        <CollapsibleCardTitle title={file.newPath}>
          {file.newPath}
        </CollapsibleCardTitle>
      </CollapsibleCardHeader>
      <CollapsibleCardContent>
        <Diff fileName="file-changes.tsx" hunks={file.hunks} type={file.type}>
          {file.hunks.map((hunk) => (
            <Hunk hunk={hunk} key={hunk.content} />
          ))}
        </Diff>
      </CollapsibleCardContent>
    </CollapsibleCard>
  );
}
