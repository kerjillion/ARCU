import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = signal(false);
  private _user = signal<any>(null);

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  get user() {
    return this._user;
  }

  login(user: any) {
    this._user.set(user);
    this._isAuthenticated.set(true);
  }

  logout() {
    this._user.set(null);
    this._isAuthenticated.set(false);
  }
}
