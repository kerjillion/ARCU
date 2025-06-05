import { Component, Input, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-floating-menu',
  standalone: true,
  imports: [NgFor, MatIconModule, MatButtonModule],
  template: `
    <div class="floating-menu-container">
      <button mat-fab color="primary" class="menu-toggle" (click)="toggleMenu()">
        <mat-icon>more_vert</mat-icon>
      </button>
      <div class="menu-items" *ngIf="open()">
        <button
          *ngFor="let item of items"
          mat-mini-fab
          [color]="item.color || 'primary'"
          class="menu-item"
          (click)="item.action?.()"
          [attr.aria-label]="item.label"
        >
          <mat-icon>{{ item.icon }}</mat-icon>
        </button>
      </div>
    </div>
  `,
  // styleUrls: ['./floating-menu.component.scss']
})
export class FloatingMenuComponent {
  @Input() items: { icon: string; label?: string; color?: string; action?: () => void }[] = [];
  open = signal(false);

  toggleMenu() {
    this.open.update(v => !v);
  }
}