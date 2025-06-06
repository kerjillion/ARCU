import { CommonModule, NgClass } from '@angular/common';
import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-floating-menu',
  standalone: true,
  imports: [NgClass, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss']
})
export class FloatingMenuComponent {
  @Input() items: { icon: string; label?: string; color?: string; action?: () => void }[] = [];
  open = signal(false);
  spinning = signal(false);

  toggleMenu() {
    this.open.update(v => !v);
    this.spinning.update(v => !v);
  }
}