import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/global-error-handler';
import { LoadingInterceptor } from './core/loading.interceptor';
import { ErrorMonitoringService } from './core/error-monitoring.service';
import { errorMonitoringConfig } from '../environments/error-monitoring.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        LoadingInterceptor
      ])
    ),
    provideAnimationsAsync(), // Required for MatSnackBar
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: 'ERROR_MONITORING_CONFIG', useValue: errorMonitoringConfig },
    ErrorMonitoringService
  ]
};
