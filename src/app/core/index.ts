export * from './auth.service';
export * from './api.service';
export * from './state.service';
export * from './assessment-state.service';

/*
core/index.ts Documentation
--------------------------

This file serves as a barrel for the core module, re-exporting key services and utilities for easier imports throughout the application.

Exports:
- auth.service: Authentication state and logic
- api.service: HTTP API calls with loading state
- state.service: Shared application state management
- assessment-state.service: Assessment-related state and logic

Usage:
Instead of importing services individually from their paths, you can import them from the core barrel:
  import { AuthService, ApiService } from 'src/app/core';

This improves maintainability and simplifies import statements across the codebase.
*/
