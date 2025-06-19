import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = signal(0);
  readonly loading$ = computed(() => this.loadingCount() > 0);

  show() {
    this.loadingCount.set(this.loadingCount() + 1);
  }

  hide() {
    this.loadingCount.set(Math.max(0, this.loadingCount() - 1));
  }
}

/**
 * LoadingService
 *
 * Provides a global loading state for the application using Angular signals and computed properties.
 * - `show()`: Increments the loading counter, setting loading$ to true if any loading is in progress.
 * - `hide()`: Decrements the counter, setting loading$ to false when all loading is complete.
 * - `loading$`: A computed signal that is true if any loading is active, false otherwise.
 *
 * Used by HTTP interceptors and components to display a global loading spinner overlay.
 *
 * Usage example:
 *   this.loadingService.show(); // Start loading
 *   this.loadingService.hide(); // Stop loading
 *
 * See also: src/app/core/loading.interceptor.ts
 */
