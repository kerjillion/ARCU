import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateService {
  private _state = signal<Record<string, any>>({});

  get state() {
    return this._state;
  }

  setState(key: string, value: any) {
    this._state.update(state => ({ ...state, [key]: value }));
  }

  getState<T = any>(key: string): T | undefined {
    return this._state()[key];
  }

  reset() {
    this._state.set({});
  }
}

/*
StateService Documentation
-------------------------

StateService is a simple, application-wide state manager using Angular signals.

Features:
- Stores state as a reactive object using a signal.
- Provides `setState(key, value)` to update a specific key in the state.
- Provides `getState(key)` to retrieve a value by key (with optional generic typing).
- Provides `reset()` to clear all state.
- Exposes the entire state as a signal for reactive UI updates.

Usage:
1. Inject StateService into your component or service:
   constructor(private state: StateService) {}

2. Set a value:
   this.state.setState('theme', 'dark');

3. Get a value:
   const theme = this.state.getState<string>('theme');

4. Reset all state:
   this.state.reset();

5. Use the state signal in your template for reactive updates:
   <ng-container *ngIf="state.state() as appState">{{ appState | json }}</ng-container>

This service is suitable for lightweight, global state management in Angular applications.
*/
