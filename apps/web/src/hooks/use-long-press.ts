import { useCallback, useRef } from "react";

const DEFAULT_DELAY = 300;
const DEFAULT_INTERVAL = 50;

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  delay?: number;
  interval?: number;
  disabled?: boolean;
}

export function useLongPress(options: UseLongPressOptions) {
  const {
    onLongPress,
    onClick,
    delay = DEFAULT_DELAY,
    interval = DEFAULT_INTERVAL,
    disabled = false,
  } = options;

  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isLongPressRef = useRef(false);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isLongPressRef.current = false;
  }, []);

  const start = useCallback(() => {
    if (disabled) {
      return;
    }

    cleanup();
    isLongPressRef.current = false;

    // Initial delay before starting continuous zoom
    timeoutRef.current = window.setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress();

      // Start continuous interval
      intervalRef.current = window.setInterval(() => {
        onLongPress();
      }, interval);
    }, delay);
  }, [disabled, cleanup, onLongPress, delay, interval]);

  const stop = useCallback(() => {
    cleanup();

    // If it was a quick press (not long-press), trigger onClick
    if (!isLongPressRef.current && onClick && !disabled) {
      onClick();
    }

    isLongPressRef.current = false;
  }, [cleanup, onClick, disabled]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        // Left mouse button only
        start();
      }
    },
    [start]
  );

  const onMouseUp = useCallback(() => {
    stop();
  }, [stop]);

  const onMouseLeave = useCallback(() => {
    stop();
  }, [stop]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault(); // Prevent scrolling
      start();
    },
    [start]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      stop();
    },
    [stop]
  );

  return {
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
  };
}
