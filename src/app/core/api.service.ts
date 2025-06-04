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
