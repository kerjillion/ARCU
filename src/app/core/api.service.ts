import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private _loading = signal(false);

  constructor(private http: HttpClient) {}

  get loading() {
    return this._loading;
  }

  get<T>(url: string) {
    this._loading.set(true);
    return this.http.get<T>(url).pipe(
      finalize(() => this._loading.set(false))
    );
  }

  post<T>(url: string, body: any) {
    this._loading.set(true);
    return this.http.post<T>(url, body).pipe(
      finalize(() => this._loading.set(false))
    );
  }
}

/*
ApiService Documentation
-----------------------

ApiService is an Angular service for making HTTP GET and POST requests with a reactive loading state using Angular signals.

Features:
- Uses Angular's HttpClient for HTTP requests.
- Exposes a `loading` signal to track request state (true when a request is in progress, false otherwise).
- Automatically manages the loading state for each request using the RxJS `finalize` operator.
- Provides generic `get<T>(url: string)` and `post<T>(url: string, body: any)` methods for type-safe API calls.

Usage:
1. Inject ApiService into your component or service:
   constructor(private api: ApiService) {}

2. Make requests and subscribe to the result:
   this.api.get<MyType>('/api/data').subscribe(data => { ... });
   this.api.post<MyType>('/api/data', payload).subscribe(result => { ... });

3. Use the `loading` signal to show/hide loading indicators:
   <ng-container *ngIf="api.loading()">Loading...</ng-container>

This service helps centralize API calls and provides a simple, reactive way to manage loading state in your Angular application.
*/
