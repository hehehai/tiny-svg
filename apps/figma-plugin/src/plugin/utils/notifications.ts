import { emit } from "@create-figma-plugin/utilities";
import type { ErrorHandler } from "@/types/messages";

/**
 * Send error message to UI and show Figma notification
 */
export function sendError(message: string, details?: string): void {
  emit<ErrorHandler>("ERROR", message, details);
  figma.notify(message, { error: true });
}

/**
 * Send success notification
 */
export function sendSuccess(message: string): void {
  figma.notify(message);
}

/**
 * Handle async errors with consistent error messaging
 */
export async function handleAsyncError<T>(
  operation: () => Promise<T>,
  errorPrefix: string
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? `${errorPrefix}: ${error.message}` : errorPrefix;
    sendError(errorMessage);
    return;
  }
}
