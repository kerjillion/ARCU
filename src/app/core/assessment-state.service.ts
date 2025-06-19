import { Injectable, signal } from '@angular/core';

export interface AssessmentSummary {
  id: string;
  name: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AssessmentStateService {
  readonly id = signal<string | null>(null);
  readonly name = signal<string>('');
  readonly status = signal<string>('');

  setAssessment(summary: AssessmentSummary) {
    this.id.set(summary.id);
    this.name.set(summary.name);
    this.status.set(summary.status);
  }

  clear() {
    this.id.set(null);
    this.name.set('');
    this.status.set('');
  }
}

/**
 * AssessmentStateService
 *
 * Manages the state of the currently selected assessment using Angular signals.
 * - `id`, `name`, `status`: Signals holding the current assessment's ID, name, and status.
 * - `setAssessment(summary)`: Updates all signals with the provided assessment summary.
 * - `clear()`: Resets all signals to their default (empty) values.
 *
 * This service provides a reactive, injectable store for assessment context, allowing components to access and update assessment state throughout the app.
 *
 * Usage example:
 *   this.assessmentState.setAssessment({ id, name, status });
 *   this.assessmentState.clear();
 */
