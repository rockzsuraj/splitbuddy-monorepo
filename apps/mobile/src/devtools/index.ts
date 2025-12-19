import { logger } from './Logger';

// Export all dev tools for easy importing
export { logger } from './Logger';
export { ErrorBoundary } from './ErrorBoundary';
export { default as LogViewer } from './LogViewer';
export { default as DevMenu } from './DevMenu';
export { default as DevBadge } from './DevBadge';

// Utility functions for easy logging
export const logError = (error: Error, context?: string) => {
  logger.logAppError(error, context);
};

export const logApiError = (error: any, endpoint?: string) => {
  logger.logApiError(error, endpoint);
};

export const logInfo = (message: string, data?: any) => {
  console.log(message, data);
};

export const logWarning = (message: string, data?: any) => {
  console.warn(message, data);
};