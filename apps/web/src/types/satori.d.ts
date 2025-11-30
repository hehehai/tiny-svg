// Type definitions for satori JSX elements with tw prop
// Satori uses the tw prop for Tailwind-like styling in OG image generation

declare global {
  namespace React {
    interface HTMLAttributes<T> {
      tw?: string;
    }

    interface SVGAttributes<T> {
      tw?: string;
    }
  }
}

export {};
