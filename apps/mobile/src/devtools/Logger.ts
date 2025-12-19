type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'api';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 500;
  private originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  };

  constructor() {
    this.interceptConsole();
  }

  private interceptConsole() {
    console.log = (...args) => {
      this.addLog('info', this.formatArgs(args));
      this.originalConsole.log(...args);
    };

    console.warn = (...args) => {
      this.addLog('warn', this.formatArgs(args));
      this.originalConsole.warn(...args);
    };

    console.error = (...args) => {
      this.addLog('error', this.formatArgs(args), args[0]?.stack);
      this.originalConsole.error(...args);
    };

    console.debug = (...args) => {
      this.addLog('debug', this.formatArgs(args));
      this.originalConsole.debug(...args);
    };
  }

  private formatArgs(args: any[]): string {
    return args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
  }

  private addLog(level: LogLevel, message: string, stack?: string, data?: any) {
    const log: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      data,
      stack,
    };

    this.logs.unshift(log);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  logApiError(error: any, endpoint?: string) {
    const message = `API Error${endpoint ? ` (${endpoint})` : ''}: ${error.message || 'Unknown error'}`;
    this.addLog('api', message, error.stack, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      },
    });
  }

  logAppError(error: Error, context?: string) {
    const message = `App Error${context ? ` (${context})` : ''}: ${error.message}`;
    this.addLog('error', message, error.stack);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }
}

export const logger = new Logger();
export type { LogEntry, LogLevel };