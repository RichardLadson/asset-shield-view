interface PerformanceLog {
  operation: string;
  startTime: number;
  metadata?: Record<string, any>;
}

interface UsePerformanceLoggerReturn {
  startTiming: (operation: string, metadata?: Record<string, any>) => string;
  endTiming: (timingId: string) => void;
  logApiCall: (endpoint: string, method: string, duration: number, status: number) => void;
  logFormAction: (action: string, formSection: string, duration?: number) => void;
}

const isDevelopment = import.meta.env.DEV;

export const usePerformanceLogger = (): UsePerformanceLoggerReturn => {
  // Store active timings
  const timings = new Map<string, PerformanceLog>();

  const startTiming = (operation: string, metadata?: Record<string, any>): string => {
    const timingId = `${operation}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    timings.set(timingId, {
      operation,
      startTime: performance.now(),
      metadata
    });
    
    if (isDevelopment) {
      console.log(`⏱️ Started: ${operation}`, metadata);
    }
    
    return timingId;
  };

  const endTiming = (timingId: string): void => {
    const timing = timings.get(timingId);
    if (!timing) return;

    const duration = performance.now() - timing.startTime;
    timings.delete(timingId);

    // Log performance
    if (isDevelopment) {
      const emoji = duration < 100 ? '⚡' : duration < 500 ? '🔄' : '🐌';
      console.log(`${emoji} ${timing.operation}: ${duration.toFixed(1)}ms`, timing.metadata);
    }

    // Send to analytics in production (optional)
    if (!isDevelopment && duration > 1000) {
      // You can send slow operations to your analytics service
      console.warn(`Slow operation detected: ${timing.operation} took ${duration.toFixed(1)}ms`);
    }
  };

  const logApiCall = (endpoint: string, method: string, duration: number, status: number): void => {
    const emoji = status >= 200 && status < 300 ? '✅' : '❌';
    const speedEmoji = duration < 200 ? '⚡' : duration < 1000 ? '🔄' : '🐌';
    
    if (isDevelopment) {
      console.log(`${emoji}${speedEmoji} API ${method} ${endpoint}: ${duration.toFixed(1)}ms (${status})`);
    }

    // Log slow API calls even in production
    if (duration > 2000) {
      console.warn(`Slow API call: ${method} ${endpoint} took ${duration.toFixed(1)}ms`);
    }
  };

  const logFormAction = (action: string, formSection: string, duration?: number): void => {
    if (isDevelopment) {
      const durationText = duration ? ` (${duration.toFixed(1)}ms)` : '';
      console.log(`📝 Form ${action} in ${formSection}${durationText}`);
    }
  };

  return {
    startTiming,
    endTiming,
    logApiCall,
    logFormAction
  };
};