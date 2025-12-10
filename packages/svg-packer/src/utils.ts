// don't move this to index.ts, we need to import both in the shared test package and will break the browser test
export const FileExtensions = [
  "eot",
  "ttf",
  "woff",
  "woff2",
  "svg",
  "css",
  "demoHTML",
] as const;
export type FileExtension = (typeof FileExtensions)[number];
