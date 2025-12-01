export type BackgroundStyle =
  | "transparent-light"
  | "transparent-dark"
  | "solid-light"
  | "solid-dark";

export const BACKGROUND_STYLES: Record<
  BackgroundStyle,
  { label: string; className: string; icon: string }
> = {
  "transparent-light": {
    label: "Transparent Light",
    className:
      "bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]",
    icon: "i-hugeicons-grid",
  },
  "transparent-dark": {
    label: "Transparent Dark",
    className:
      "bg-[linear-gradient(45deg,#333_25%,transparent_25%,transparent_75%,#333_75%,#333),linear-gradient(45deg,#333_25%,transparent_25%,transparent_75%,#333_75%,#333)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] bg-gray-900",
    icon: "i-hugeicons-grid",
  },
  "solid-light": {
    label: "Solid Light",
    className: "bg-white",
    icon: "i-hugeicons-sun-03",
  },
  "solid-dark": {
    label: "Solid Dark",
    className: "bg-gray-900",
    icon: "i-hugeicons-moon-02",
  },
};

// Zoom constants
export const DEFAULT_ZOOM = 100;
export const MAX_ZOOM = 800;
export const MIN_ZOOM = 20;
export const ZOOM_STEP = 20;
export const WHEEL_ZOOM_STEP = 10;
export const ZOOM_SCALE_DIVISOR = 100;
