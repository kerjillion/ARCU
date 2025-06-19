import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggingService } from './logging.service';
import { ErrorMonitoringService } from './error-monitoring.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}
  handleError(error: any): void {
    const logger = this.injector.get(LoggingService);
    const errorMonitoring = this.injector.get(ErrorMonitoringService);
    
    // Log the error
    logger.error('Global error caught:', error);
    
    // Extract meaningful error information
    const errorMessage = this.getErrorMessage(error);
    const errorStack = this.getErrorStack(error);
    
    // Log structured error info
    const errorContext = {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    logger.error('Error Details:', errorContext);
      // Report to monitoring services
    errorMonitoring.reportError(error, errorContext);
    
    // Show user-friendly notifications
    this.showUserNotification(errorMessage);
    
    // Only re-throw in very specific production error debugging scenarios
    // For now, we handle errors gracefully without re-throwing
  }
  
  private getErrorMessage(error: any): string {
    if (error?.message) return error.message;
    if (error?.error?.message) return error.error.message;
    if (typeof error === 'string') return error;
    return 'Unknown error occurred';  }
  
  private getErrorStack(error: any): string {
    if (error?.stack) return error.stack;
    if (error?.error?.stack) return error.error.stack;
    return 'No stack trace available';
  }
  
  // Implement user-friendly error notifications
  private showUserNotification(message: string): void {
    try {
      const snackBar = this.injector.get(MatSnackBar);
      const userFriendlyMessage = this.getUserFriendlyMessage(message);
      
      snackBar.open(userFriendlyMessage, 'Dismiss', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } catch (snackBarError) {
      // Fallback if MatSnackBar isn't available
      console.warn('Could not show user notification:', snackBarError);
      console.warn('Original error message:', message);
    }
  }
    private getUserFriendlyMessage(technicalMessage: string): string {
    // Convert technical error messages to user-friendly ones
    const lowerMessage = technicalMessage.toLowerCase();
    
    if (lowerMessage.includes('expressionchangedafterithasbeenchecked') || lowerMessage.includes('ng0100')) {
      return 'The application updated its display unexpectedly. Please refresh the page.';
    }
    
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    
    if (lowerMessage.includes('timeout')) {
      return 'The request took too long. Please try again.';
    }
    
    if (lowerMessage.includes('permission') || lowerMessage.includes('unauthorized')) {
      return 'You do not have permission to perform this action.';
    }
    
    if (lowerMessage.includes('not found') || lowerMessage.includes('404')) {
      return 'The requested information could not be found.';
    }
    
    if (lowerMessage.includes('method not implemented')) {
      return 'This feature is not yet available. Please try again later.';
    }
    
    // Default user-friendly message
    return 'Something went wrong. Please refresh the page and try again.';
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
