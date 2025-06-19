import { ErrorMonitoringConfig } from '../app/core/error-monitoring.service';
import { environment } from './environment';

/**
 * Error monitoring configuration for different environments
 */
export const errorMonitoringConfig: ErrorMonitoringConfig = {
  // Enable remote logging in production
  enableRemoteLogging: environment.production,
  
  // Enable console logging in development
  enableConsoleLogging: !environment.production,
  
  // Custom API endpoint for error reporting
  customApiEndpoint: environment.production ? '/api/errors' : undefined,
  
  // Sentry configuration (uncomment and configure when using Sentry)
  // sentryDsn: environment.production ? 'YOUR_SENTRY_DSN_HERE' : undefined,
  
  // LogRocket configuration (uncomment and configure when using LogRocket)
  // logRocketId: environment.production ? 'YOUR_LOGROCKET_ID_HERE' : undefined,
  
  // Error batching and retry configuration
  maxRetries: 3,
  batchSize: 10,
  flushInterval: 30000 // 30 seconds
};

/**
 * Instructions for integrating with external monitoring services:
 * 
 * 1. SENTRY INTEGRATION:
 *    npm install @sentry/angular @sentry/tracing
 *    
 *    In main.ts, add:
 *    import * as Sentry from '@sentry/angular';
 *    
 *    Sentry.init({
 *      dsn: 'YOUR_SENTRY_DSN_HERE',
 *      environment: environment.production ? 'production' : 'development',
 *      tracesSampleRate: 1.0,
 *      integrations: [
 *        new Sentry.BrowserTracing({
 *          routingInstrumentation: Sentry.routingInstrumentation,
 *        }),
 *      ],
 *    });
 * 
 * 2. LOGROCKET INTEGRATION:
 *    npm install logrocket
 *    
 *    In main.ts, add:
 *    import LogRocket from 'logrocket';
 *    
 *    if (environment.production) {
 *      LogRocket.init('YOUR_LOGROCKET_ID_HERE');
 *    }
 * 
 * 3. CUSTOM API INTEGRATION:
 *    Set up an endpoint on your backend to receive error data:
 *    POST /api/errors
 *    Body: ErrorData interface structure
 * 
 * 4. UPDATING CONFIGURATION:
 *    Modify the errorMonitoringConfig object above with your actual
 *    service credentials and endpoints.
 */
