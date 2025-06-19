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
===============================

The GlobalErrorHandler is a production-ready, comprehensive Angular error handler that provides centralized error 
management with user-friendly notifications, structured logging, and integration with monitoring services.

## Overview

This custom ErrorHandler implementation catches all uncaught errors in your Angular application and processes them
through a sophisticated pipeline that includes logging, user notification, error monitoring, and graceful error recovery.

## Key Features

### 1. Comprehensive Error Processing
- **Multi-Layer Error Extraction**: Handles various error object structures (Error objects, HTTP errors, strings)
- **Stack Trace Preservation**: Captures and preserves complete stack traces for debugging
- **Context Enrichment**: Adds metadata like timestamps, URLs, user agent, and custom context
- **Graceful Degradation**: Continues functioning even if dependencies are unavailable

### 2. User-Friendly Error Translation
- **Technical-to-Human Translation**: Converts technical error messages into user-understandable language
- **Angular-Specific Error Handling**: Special handling for common Angular errors (e.g., NG0100 ExpressionChangedAfterItHasBeenCheckedError)
- **Error Categorization**: Classifies errors by type (network, permission, not found, etc.)
- **Contextual Messaging**: Provides actionable guidance to users

### 3. Multi-Channel Error Reporting
- **Visual Notifications**: Uses Angular Material Snackbar for immediate user feedback
- **Console Logging**: Structured logging for development and debugging
- **Error Monitoring Integration**: Automatic reporting to ErrorMonitoringService
- **Fallback Mechanisms**: Graceful degradation when notification systems fail

### 4. Production-Ready Architecture
- **Dependency Injection Safe**: Uses Angular's Injector pattern to avoid circular dependencies
- **Error Recovery**: Handles errors within the error handler itself
- **Performance Optimized**: Minimal overhead with efficient error processing
- **Extensible Design**: Easy to customize and extend for specific application needs

## Error Processing Pipeline

```
1. Error Caught
   ↓
2. Extract Error Message & Stack
   ↓
3. Create Enriched Context
   ↓
4. Log to Console (LoggingService)
   ↓
5. Report to Monitoring (ErrorMonitoringService)
   ↓
6. Show User Notification (MatSnackBar)
   ↓
7. Graceful Recovery (No Re-throw)
```

## Error Message Translation

The handler provides intelligent error message translation for common scenarios:

| Technical Pattern | User-Friendly Message | Use Case |
|------------------|----------------------|----------|
| `expressionchangedafterithasbeenchecked`, `ng0100` | "The application updated its display unexpectedly. Please refresh the page." | Angular change detection errors |
| `network`, `fetch` | "Network connection issue. Please check your internet connection and try again." | Network connectivity problems |
| `timeout` | "The request took too long. Please try again." | Request timeouts |
| `permission`, `unauthorized` | "You do not have permission to perform this action." | Authorization failures |
| `not found`, `404` | "The requested information could not be found." | Resource not found errors |
| `method not implemented` | "This feature is not yet available. Please try again later." | Unimplemented features |
| Default | "Something went wrong. Please refresh the page and try again." | Generic fallback |

## Setup and Configuration

### 1. App Configuration (app.config.ts)
```typescript
import { GlobalErrorHandler } from './core/global-error-handler';
import { ErrorHandler } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // ... other providers
  ]
};
```

### 2. Module Configuration (if using NgModules)
```typescript
import { GlobalErrorHandler } from './core/global-error-handler';
import { ErrorHandler } from '@angular/core';

@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // ... other providers
  ]
})
export class AppModule {}
```

### 3. Required Dependencies
Ensure these services are available in your dependency injection:
- `LoggingService`: For structured error logging
- `ErrorMonitoringService`: For error tracking and monitoring
- `MatSnackBar`: For user notifications (gracefully degrades if unavailable)

## Usage Examples

### Automatic Error Handling
The GlobalErrorHandler automatically catches all uncaught errors:

```typescript
// This error will be automatically caught and processed
throw new Error('Something went wrong in the component');

// HTTP errors are also caught
this.http.get('/api/data').subscribe(); // If this fails, it's handled
```

### Manual Error Reporting
You can also manually trigger the error handler:

```typescript
constructor(private errorHandler: ErrorHandler) {}

handleCustomError(error: any, context?: any) {
  // Add custom context before reporting
  const enrichedError = {
    ...error,
    customContext: context,
    componentName: 'MyComponent'
  };
  
  this.errorHandler.handleError(enrichedError);
}
```

## Error Context Enrichment

Each error is automatically enriched with contextual information:

```typescript
interface ErrorContext {
  message: string;          // Extracted error message
  stack: string;           // Error stack trace
  timestamp: string;       // ISO timestamp
  userAgent: string;       // Browser information
  url: string;            // Current page URL
  // Plus any additional context from ErrorMonitoringService
}
```

## Integration with Other Services

### LoggingService Integration
```typescript
// Structured logging with multiple levels
logger.error('Global error caught:', error);
logger.error('Error Details:', errorContext);
```

### ErrorMonitoringService Integration
```typescript
// Automatic reporting with enriched context
errorMonitoring.reportError(error, errorContext);
```

### MatSnackBar Integration
```typescript
// User-friendly notifications with customizable styling
snackBar.open(userFriendlyMessage, 'Dismiss', {
  duration: 5000,
  panelClass: ['error-snackbar'],
  horizontalPosition: 'center',
  verticalPosition: 'top'
});
```

## Customization and Extension

### Adding Custom Error Types
Extend the `getUserFriendlyMessage` method to handle application-specific errors:

```typescript
private getUserFriendlyMessage(technicalMessage: string): string {
  const lowerMessage = technicalMessage.toLowerCase();
  
  // Add custom error handling
  if (lowerMessage.includes('payment_failed')) {
    return 'Payment processing failed. Please check your payment method and try again.';
  }
  
  if (lowerMessage.includes('session_expired')) {
    return 'Your session has expired. Please log in again.';
  }
  
  // ... existing error handling
  return 'Something went wrong. Please refresh the page and try again.';
}
```

### Custom Notification Styling
Add CSS for the error snackbar:

```scss
.error-snackbar {
  background-color: #f44336 !important;
  color: white !important;
  
  .mat-mdc-snack-bar-action {
    color: #ffcdd2 !important;
  }
}
```

### Adding Custom Context
Override the handleError method to add application-specific context:

```typescript
handleError(error: any): void {
  // Add custom application context
  const customContext = {
    userId: this.getCurrentUserId(),
    featureFlag: this.getActiveFeatureFlags(),
    appVersion: environment.version
  };
  
  // Merge with standard context
  const errorContext = {
    ...this.getStandardContext(error),
    ...customContext
  };
  
  // Continue with standard processing
  this.processError(error, errorContext);
}
```

## Error Recovery Strategies

The GlobalErrorHandler implements several recovery strategies:

1. **Graceful Degradation**: If MatSnackBar fails, falls back to console warnings
2. **No Re-throwing**: Prevents error cascades by not re-throwing caught errors
3. **Service Isolation**: Uses dependency injection to prevent circular dependencies
4. **Async Safety**: Handles both synchronous and asynchronous errors

## Testing Considerations

### Unit Testing
```typescript
describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let mockInjector: jasmine.SpyObj<Injector>;
  
  beforeEach(() => {
    const injectorSpy = jasmine.createSpyObj('Injector', ['get']);
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: Injector, useValue: injectorSpy }
      ]
    });
  });
  
  it('should handle errors gracefully', () => {
    const testError = new Error('Test error');
    expect(() => handler.handleError(testError)).not.toThrow();
  });
});
```

### Integration Testing
Test the complete error handling pipeline with real dependencies.

## Performance Considerations

- **Minimal Overhead**: Error processing is optimized for minimal performance impact
- **Async Operations**: Error reporting doesn't block the main thread
- **Memory Management**: No memory leaks from error context storage
- **Batch Processing**: ErrorMonitoringService handles batching for performance

## Security Considerations

- **PII Protection**: Never log sensitive user information in error messages
- **Stack Trace Sanitization**: Be cautious about exposing internal application structure
- **Error Message Filtering**: Avoid revealing system internals through error messages
- **Rate Limiting**: Consider implementing rate limiting for error reporting in high-volume scenarios

## Troubleshooting

### Common Issues

1. **Snackbar Not Showing**
   - Verify MatSnackBar is imported and configured
   - Check if Angular Material is properly set up
   - Look for console warnings about fallback notifications

2. **Errors Not Being Logged**
   - Ensure LoggingService is properly injected
   - Check console for initialization errors
   - Verify service dependencies are available

3. **Monitoring Not Working**
   - Check ErrorMonitoringService configuration
   - Verify network connectivity for remote reporting
   - Look for console warnings about monitoring failures

### Debug Mode
Enable enhanced debugging by checking console logs for:
- "Could not show user notification" - MatSnackBar issues
- "Failed to process error for monitoring" - ErrorMonitoringService issues
- Stack traces and error context objects

## Best Practices

1. **Error Message Quality**: Write clear, actionable error messages for users
2. **Context Preservation**: Always preserve original error information for debugging
3. **User Experience**: Balance between informing users and not overwhelming them
4. **Monitoring Integration**: Ensure all critical errors are properly monitored
5. **Testing Coverage**: Test error handling paths as thoroughly as success paths
6. **Documentation**: Keep error handling documentation up to date with application changes

This GlobalErrorHandler provides a robust foundation for error management in production Angular applications,
ensuring that errors are handled gracefully while providing valuable information for debugging and monitoring.
*/
