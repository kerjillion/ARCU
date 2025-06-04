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
