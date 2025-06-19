import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from './loading.service';

export const LoadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loading = inject(LoadingService);
  loading.show();
  return next(req).pipe(
    finalize(() => loading.hide())
  );
};

/**
 * LoadingInterceptor
 *
 * This Angular HTTP interceptor function manages the global loading state:
 * - Calls loading.show() before each HTTP request to increment the loading counter.
 * - Calls loading.hide() after the request completes (success or error) to decrement the counter.
 * - Integrates with LoadingService, which uses Angular signals for reactivity.
 * - Used to control a global loading spinner overlay in the UI.
 *
 * Register this interceptor in your app configuration using:
 *   provideHttpClient(withInterceptors([LoadingInterceptor]))
 *
 * See also: src/app/core/loading.service.ts
 */
