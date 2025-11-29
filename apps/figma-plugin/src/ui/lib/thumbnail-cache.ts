class ThumbnailCache {
  private readonly cache = new Map<string, string>();
  private readonly maxSize = 100;

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: string): void {
    // Implement LRU eviction
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  get size(): number {
    return this.cache.size;
  }
}

export const thumbnailCache = new ThumbnailCache();
