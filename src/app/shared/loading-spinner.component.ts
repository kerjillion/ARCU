import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [NgIf, MatProgressSpinnerModule],
  template: `
    <div class="loading-overlay" *ngIf="loading">
      <mat-progress-spinner mode="indeterminate" color="primary"></mat-progress-spinner>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255,255,255,0.5);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() loading = false;
}
