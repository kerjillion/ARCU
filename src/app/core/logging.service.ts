import { Injectable, isDevMode } from '@angular/core';

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  log(message: string, ...optional: any[]) {
    if (isDevMode()) {
      console.log('[LOG]', message, ...optional);
    }
  }

  info(message: string, ...optional: any[]) {
    if (isDevMode()) {
      console.info('[INFO]', message, ...optional);
    }
  }

  warn(message: string, ...optional: any[]) {
    if (isDevMode()) {
      console.warn('[WARN]', message, ...optional);
    }
  }

  error(message: string, ...optional: any[]) {
    // Always log errors, even in production
    console.error('[ERROR]', message, ...optional);
    // Optionally: send errors to a remote server here
  }

  debug(message: string, ...optional: any[]) {
    if (isDevMode()) {
      console.debug('[DEBUG]', message, ...optional);
    }
  }
}
