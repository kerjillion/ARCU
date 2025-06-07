import { CommonModule, NgClass } from '@angular/common';
import { Component, Input, ElementRef, AfterViewInit, HostListener, signal, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-floating-menu',
  standalone: true,
  imports: [NgClass, MatIconModule, MatButtonModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss']
})
export class FloatingMenuComponent implements AfterViewInit, OnDestroy {
  @Input() items: {
    icon: string;
    label?: string;
    color?: string;
    action?: () => void;
    disabled?: boolean;
    backgroundColor?: string;
    foregroundColor?: string;
  }[] = [];
  @Input() menuPosition: 'left' | 'right' | null = null;
  @Input() left: string = 'auto';      // <-- Default to 'auto'
  @Input() right: string = 'auto';     // <-- Default to 'auto'
  @Input() top: string = 'auto';       // <-- Default to 'auto'
  @Input() bottom: string = 'auto';    // <-- Default to 'auto'
  @Input() defaultOpen: boolean = false;
  @Input() hideToggle: boolean = false;
  @Input() horizontal: boolean = false;

  open = signal(this.defaultOpen);
  spinning = signal(false);

  private handleDocumentClick = (event: MouseEvent) => {
    if (
      !this.defaultOpen &&
      this.open() &&
      this.el.nativeElement &&
      !this.el.nativeElement.contains(event.target)
    ) {
      this.open.set(false);
    }
  };
blue: any;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    document.addEventListener('mousedown', this.handleDocumentClick, true);
  }

  ngOnDestroy() {
    document.removeEventListener('mousedown', this.handleDocumentClick, true);
  }

  onMenuItemClick(item: any) {
    item.action?.();
    if (!this.defaultOpen) {
      this.open.set(false);
    }
  }

  toggleMenu() {
    this.open.update(v => !v);
    this.spinning.update(v => !v);
  }
}