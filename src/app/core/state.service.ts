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
