import { CommonModule, NgClass } from '@angular/common';
import { Component, Input, ElementRef, AfterViewInit, ChangeDetectionStrategy, OnDestroy, signal, effect } from '@angular/core';
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
  // Make items a signal for reactivity
  private _items = signal<any[]>([]);
  @Input() set items(value: any[]) { this._items.set(value ?? []); }
  get items() { return this._items(); }

  @Input() menuPosition: 'left' | 'right' | null = null;
  @Input() left: string = 'auto';
  @Input() right: string = 'auto';
  @Input() top: string = 'auto';
  @Input() bottom: string = 'auto';
  @Input() defaultOpen: boolean = false;
  @Input() hideToggle: boolean = false;
  @Input() horizontal: boolean = false;
  @Input() controlImageSrc: string | null = null;

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