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

/*
LoggingService Documentation
--------------------------

LoggingService is a centralized logging utility for Angular applications.

Features:
- Supports multiple log levels: log, info, warn, error, and debug.
- Uses Angular's isDevMode() to restrict log, info, warn, and debug messages to development mode only.
- Always logs errors (error level) in both development and production environments.
- Can be extended to send error logs to a remote server for monitoring and alerting.

Usage:
1. Inject LoggingService into your component or service:
   constructor(private logger: LoggingService) {}

2. Log messages at various levels:
   this.logger.log('A log message');
   this.logger.info('Some info');
   this.logger.warn('A warning');
   this.logger.error('An error occurred', errorObj);
   this.logger.debug('Debug details', details);

This service helps standardize and control logging output across your Angular application.
*/
