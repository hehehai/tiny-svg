declare module "ttf2woff" {
  function ttf2woff(
    buffer: Uint8Array,
    options?: { metadata?: string }
  ): Buffer;
  export = ttf2woff;
}
