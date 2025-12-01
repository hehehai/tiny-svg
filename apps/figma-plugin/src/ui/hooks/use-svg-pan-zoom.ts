import { useEffect, useRef, useState } from "react";

const DEFAULT_ZOOM = 100;
const MAX_ZOOM = 800;
const MIN_ZOOM = 20;
const ZOOM_STEP = 20;
const WHEEL_ZOOM_STEP = 10;

interface UseSvgPanZoomOptions {
  defaultZoom?: number;
  maxZoom?: number;
  minZoom?: number;
  zoomStep?: number;
  wheelZoomStep?: number;
}

export function useSvgPanZoom(options: UseSvgPanZoomOptions = {}) {
  const {
    defaultZoom = DEFAULT_ZOOM,
    maxZoom = MAX_ZOOM,
    minZoom = MIN_ZOOM,
    zoomStep = ZOOM_STEP,
    wheelZoomStep = WHEEL_ZOOM_STEP,
  } = options;

  const [zoom, setZoom] = useState(defaultZoom);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLButtonElement>(null);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + zoomStep, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - zoomStep, minZoom));
  };

  const handleZoomReset = () => {
    setZoom(defaultZoom);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleWheelPassive = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY > 0 ? -wheelZoomStep : wheelZoomStep;
      setZoom((prev) => {
        const newZoom = prev + delta;
        return Math.max(minZoom, Math.min(maxZoom, newZoom));
      });
    };

    container.addEventListener("wheel", handleWheelPassive, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", handleWheelPassive);
    };
  }, [maxZoom, minZoom, wheelZoomStep]);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return {
    zoom,
    pan,
    isDragging,
    containerRef,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    minZoom,
    maxZoom,
  };
}
