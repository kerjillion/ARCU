import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * Configuration interface for error monitoring services
 */
export interface ErrorMonitoringConfig {
  sentryDsn?: string;
  logRocketId?: string;
  customApiEndpoint?: string;
  enableRemoteLogging?: boolean;
  enableConsoleLogging?: boolean;
  maxRetries?: number;
  batchSize?: number;
  flushInterval?: number;
}

/**
 * Structured error data interface
 */
export interface ErrorData {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId: string;
  buildVersion: string;
  errorType: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  context?: Record<string, any>;
  tags?: Record<string, string>;
  fingerprint?: string;
}

/**
 * Error monitoring service that provides centralized error tracking
 * and integration with multiple monitoring services.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorMonitoringService {
  private config: ErrorMonitoringConfig;
  private errorQueue: ErrorData[] = [];
  private flushTimer?: number;
  private isInitialized = false;

  constructor(
    private http: HttpClient,
    @Optional() @Inject('ERROR_MONITORING_CONFIG') config?: ErrorMonitoringConfig
  ) {
    this.config = {
      enableRemoteLogging: true,
      enableConsoleLogging: !environment.production,
      maxRetries: 3,
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
      ...config
    };
    
    this.initialize();
  }

  /**
   * Initialize monitoring services
   */
  private initialize(): void {
    if (this.isInitialized) return;

    try {
      // Initialize Sentry if configured
      if (this.config.sentryDsn && typeof window !== 'undefined') {
        this.initializeSentry();
      }

      // Initialize LogRocket if configured
      if (this.config.logRocketId && typeof window !== 'undefined') {
        this.initializeLogRocket();
      }

      // Start periodic error queue flushing
      this.startPeriodicFlush();

      this.isInitialized = true;
      console.log('Error monitoring initialized');
    } catch (error) {
      console.warn('Failed to initialize error monitoring:', error);
    }
  }

  /**
   * Initialize Sentry monitoring
   */
  private initializeSentry(): void {
    // This would typically be done in main.ts or app.config.ts
    // Here we just check if Sentry is available
    if ((window as any).Sentry) {
      console.log('Sentry monitoring is available');
    } else {
      console.log('Sentry not found. Install @sentry/angular for Sentry integration.');
    }
  }

  /**
   * Initialize LogRocket monitoring
   */
  private initializeLogRocket(): void {
    // This would typically be done in main.ts or app.config.ts
    // Here we just check if LogRocket is available
    if ((window as any).LogRocket) {
      console.log('LogRocket monitoring is available');
    } else {
      console.log('LogRocket not found. Install logrocket for LogRocket integration.');
    }
  }

  /**
   * Start periodic flushing of error queue
   */
  private startPeriodicFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = window.setInterval(() => {
      this.flushErrorQueue();
    }, this.config.flushInterval);
  }

  /**
   * Report an error to all configured monitoring services
   */
  reportError(error: any, context?: Record<string, any>): void {
    try {
      const errorData = this.prepareErrorData(error, context);
      
      if (this.config.enableConsoleLogging) {
        console.error('Error reported:', errorData);
      }

      // Add to queue for batch processing
      this.errorQueue.push(errorData);

      // Immediately send critical errors
      if (errorData.severity === 'critical') {
        this.sendErrorData(errorData);
      }

      // Flush queue if it's getting full
      if (this.errorQueue.length >= this.config.batchSize!) {
        this.flushErrorQueue();
      }

    } catch (processingError) {
      console.warn('Failed to process error for monitoring:', processingError);
    }
  }

  /**
   * Set user context for error tracking
   */
  setUserContext(userId: string, userInfo?: Record<string, any>): void {
    try {
      // Store user context
      localStorage.setItem('errorMonitoring_userId', userId);
      if (userInfo) {
        localStorage.setItem('errorMonitoring_userInfo', JSON.stringify(userInfo));
      }

      // Update Sentry user context
      if ((window as any).Sentry) {
        (window as any).Sentry.setUser({ id: userId, ...userInfo });
      }

      // Update LogRocket user context
      if ((window as any).LogRocket) {
        (window as any).LogRocket.identify(userId, userInfo);
      }

    } catch (error) {
      console.warn('Failed to set user context:', error);
    }
  }

  /**
   * Add custom tags for error categorization
   */
  setTags(tags: Record<string, string>): void {
    try {
      localStorage.setItem('errorMonitoring_tags', JSON.stringify(tags));

      // Update Sentry tags
      if ((window as any).Sentry) {
        (window as any).Sentry.setTags(tags);
      }

    } catch (error) {
      console.warn('Failed to set tags:', error);
    }
  }

  /**
   * Prepare structured error data
   */
  private prepareErrorData(error: any, context?: Record<string, any>): ErrorData {
    const errorData: ErrorData = {
      message: this.getErrorMessage(error),
      stack: this.getErrorStack(error),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      buildVersion: this.getBuildVersion(),
      errorType: error?.constructor?.name || 'Unknown',
      severity: this.getErrorSeverity(error),
      context,
      tags: this.getCurrentTags(),
      fingerprint: this.generateFingerprint(error)
    };

    return errorData;
  }

  /**
   * Send error data to all configured services
   */
  private sendErrorData(errorData: ErrorData): void {
    if (!this.config.enableRemoteLogging) return;

    // Send to custom API
    if (this.config.customApiEndpoint) {
      this.sendToCustomAPI(errorData);
    }

    // Send to Sentry
    this.sendToSentry(errorData);

    // Send to LogRocket
    this.sendToLogRocket(errorData);
  }

  /**
   * Send error to custom API endpoint
   */
  private sendToCustomAPI(errorData: ErrorData, retryCount = 0): void {
    if (!this.config.customApiEndpoint) return;

    this.http.post(this.config.customApiEndpoint, errorData).subscribe({
      next: () => {
        if (this.config.enableConsoleLogging) {
          console.log('Error sent to custom API');
        }
      },
      error: (err) => {
        console.warn('Failed to send error to custom API:', err);
        
        // Retry logic
        if (retryCount < this.config.maxRetries!) {
          setTimeout(() => {
            this.sendToCustomAPI(errorData, retryCount + 1);
          }, Math.pow(2, retryCount) * 1000); // Exponential backoff
        }
      }
    });
  }

  /**
   * Send error to Sentry
   */
  private sendToSentry(errorData: ErrorData): void {
    try {
      const sentry = (window as any).Sentry;
      if (!sentry) return;

      sentry.withScope((scope: any) => {
        scope.setTag('errorType', errorData.errorType);
        scope.setTag('severity', errorData.severity);
        scope.setLevel(this.mapSeverityToSentryLevel(errorData.severity));
        
        if (errorData.context) {
          scope.setContext('error_context', errorData.context);
        }
        
        if (errorData.tags) {
          Object.entries(errorData.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }

        scope.setFingerprint([errorData.fingerprint || errorData.message]);
        
        sentry.captureException(new Error(errorData.message));
      });

      if (this.config.enableConsoleLogging) {
        console.log('Error sent to Sentry');
      }
    } catch (error) {
      console.warn('Failed to send error to Sentry:', error);
    }
  }

  /**
   * Send error to LogRocket
   */
  private sendToLogRocket(errorData: ErrorData): void {
    try {
      const logRocket = (window as any).LogRocket;
      if (!logRocket) return;

      logRocket.captureException(new Error(errorData.message));
      
      // Add custom data
      logRocket.track('Error Occurred', {
        errorType: errorData.errorType,
        severity: errorData.severity,
        context: errorData.context,
        fingerprint: errorData.fingerprint
      });

      if (this.config.enableConsoleLogging) {
        console.log('Error sent to LogRocket');
      }
    } catch (error) {
      console.warn('Failed to send error to LogRocket:', error);
    }
  }

  /**
   * Flush the error queue
   */
  private flushErrorQueue(): void {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    errors.forEach(errorData => {
      this.sendErrorData(errorData);
    });
  }

  /**
   * Utility methods
   */
  private getErrorMessage(error: any): string {
    if (error?.message) return error.message;
    if (error?.error?.message) return error.error.message;
    if (typeof error === 'string') return error;
    return 'Unknown error occurred';
  }

  private getErrorStack(error: any): string {
    if (error?.stack) return error.stack;
    if (error?.error?.stack) return error.error.stack;
    return 'No stack trace available';
  }

  private getCurrentUserId(): string {
    return localStorage.getItem('errorMonitoring_userId') || 
           localStorage.getItem('userId') || 
           'anonymous';
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  private getBuildVersion(): string {
    return environment.production ? '1.0.0' : 'development';
  }

  private getCurrentTags(): Record<string, string> {
    try {
      const stored = localStorage.getItem('errorMonitoring_tags');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private getErrorSeverity(error: any): 'info' | 'warning' | 'error' | 'critical' {
    const message = this.getErrorMessage(error).toLowerCase();
    
    if (message.includes('network') || message.includes('timeout')) {
      return 'warning';
    }
    
    if (message.includes('unauthorized') || message.includes('permission')) {
      return 'error';
    }
    
    if (message.includes('not found')) {
      return 'info';
    }
    
    return 'critical';
  }

  private generateFingerprint(error: any): string {
    const message = this.getErrorMessage(error);
    const type = error?.constructor?.name || 'Unknown';
    return `${type}-${message}`.replace(/[^a-zA-Z0-9-_]/g, '_');
  }

  private mapSeverityToSentryLevel(severity: string): string {
    const mapping: Record<string, string> = {
      'info': 'info',
      'warning': 'warning',
      'error': 'error',
      'critical': 'fatal'
    };
    return mapping[severity] || 'error';
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
    
    // Flush remaining errors
    this.flushErrorQueue();
  }
}
