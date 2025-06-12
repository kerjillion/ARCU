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

/*
AuthService Documentation
------------------------

AuthService is a simple authentication state manager for Angular applications using signals.

Features:
- Tracks authentication state with a reactive `isAuthenticated` signal (true if logged in, false otherwise).
- Stores the current user object in a reactive `user` signal.
- Provides `login(user)` and `logout()` methods to update authentication state and user info.
- Signals allow components to reactively update the UI when authentication state changes.

Usage:
1. Inject AuthService into your component or service:
   constructor(private auth: AuthService) {}

2. Log in a user:
   this.auth.login({ id: 'user1', name: 'Alice' });

3. Log out:
   this.auth.logout();

4. Use the signals in your template:
   <ng-container *ngIf="auth.isAuthenticated()">Welcome, {{ auth.user()?.name }}</ng-container>

This service is suitable for managing simple authentication state in Angular apps. For production, integrate with a real authentication backend and secure token storage.
*/
