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
