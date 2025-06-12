import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoggingService } from './logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const logger = this.injector.get(LoggingService);
    logger.error('Global error caught:', error);
    // Optionally: Show a user-friendly message or send to remote server
    // e.g., use a snackbar, dialog, or remote logging here
  }
}

/*
GlobalErrorHandler Documentation
-------------------------------

GlobalErrorHandler is a custom Angular error handler that centralizes error handling for your application.

Features:
- Implements Angular's ErrorHandler interface to catch all uncaught errors in the app.
- Uses Angular's dependency injection (Injector) to obtain the LoggingService at runtime.
- Logs errors using the LoggingService for consistent error reporting.
- Provides a place to add user-friendly error notifications (e.g., snackbars, dialogs) or send errors to a remote server for monitoring.

Usage:
1. Register GlobalErrorHandler as the application's error handler in your app module or bootstrap configuration:
   { provide: ErrorHandler, useClass: GlobalErrorHandler }

2. Extend the handleError method to add custom error handling logic, such as displaying messages or reporting errors remotely.

This service helps ensure that all unexpected errors are logged and handled in a consistent, centralized way across your Angular application.
*/
