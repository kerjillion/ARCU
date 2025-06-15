import {
  Component,
  Input,
  signal,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
  OnDestroy
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { NgStyle, NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-fly-menu',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, DragDropModule, NgStyle, NgClass, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fly-menu.component.html',
  styleUrl: './fly-menu.component.scss'
})
export class FlyMenuComponent implements AfterViewInit, OnDestroy {
  /**
   * Array of menu items with icon, label, color, and action callback.
   */
  @Input() items: { icon: string; label?: string; color?: string; tooltip?: string; disabled?: boolean; action?: () => void }[] = [];
  /**
   * Direction in which the menu expands: 'right' | 'left' | 'up' | 'down'.
   */
  @Input() direction: 'right' | 'left' | 'up' | 'down' = 'right';
  /**
   * Whether the menu is expanded by default.
   */
  @Input() expandedByDefault = false;
  /**
   * Storage key for persisting position.
   */
  @Input() storageKey = 'flyMenuPosition';
  /**
   * Tolerance for restoring position based on screen size change.
   */
  @Input() positionTolerance: number = 0.2;

  open = signal(this.expandedByDefault);
  dragging = signal(false);
  position = signal<{ top: string; left: string }>({ top: '0px', left: '50px' });
  activeDirection = signal(this.direction);
  dragStart = false;

  @ViewChild('menuWrapper', { static: false }) menuWrapperRef!: ElementRef;

  // Add a private flag to track if direction was already adjusted for this open session
  private _directionAdjusted = false;
  private globalClickUnlisten: (() => void) | null = null;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.loadPosition();
    this.globalClickUnlisten = this.renderer.listen('document', 'mousedown', (event: MouseEvent) => {
      if (!this.menuWrapperRef?.nativeElement.contains(event.target)) {
        this.open.set(false);
        this._directionAdjusted = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.globalClickUnlisten) this.globalClickUnlisten();
  }

  toggleMenu(): void {
    if (this.dragStart) return;
    const next = !this.open();
    this.open.set(next);
    // Only adjust direction if opening (not closing)
    if (next && !this._directionAdjusted) {
      this.adjustDirectionIfOverflowing();
      this._directionAdjusted = true;
    }
    if (!next) {
      this._directionAdjusted = false;
    }
  }

  onDragStarted(): void {
    this.dragStart = true;
    this.dragging.set(true);
  }

  onDragEnd(event: CdkDragEnd): void {
    this.dragging.set(false);
    setTimeout(() => { this.dragStart = false; }, 100);
    // Get the drag offset
    const dragPosition = event.source.getFreeDragPosition();
    // Parse the current absolute position
    const current = this.position();
    const currentTop = parseFloat(current.top);
    const currentLeft = parseFloat(current.left);
    // Add the drag offset to the current position
    const newTop = currentTop + dragPosition.y;
    const newLeft = currentLeft + dragPosition.x;
    const newPos = {
      top: `${newTop}px`,
      left: `${newLeft}px`,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };
    this.position.set({ top: newPos.top, left: newPos.left });
    localStorage.setItem(this.storageKey, JSON.stringify(newPos));
    // Reset the drag position so the next drag is relative to the new spot
    event.source._dragRef.reset();
  }

  loadPosition(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      const sw = parsed.screenWidth;
      const sh = parsed.screenHeight;
      const cw = window.innerWidth;
      const ch = window.innerHeight;

      const deltaExceeded =
        Math.abs(sw - cw) / sw > this.positionTolerance ||
        Math.abs(sh - ch) / sh > this.positionTolerance;

      if (!deltaExceeded) {
        this.position.set({ top: parsed.top, left: parsed.left });
      } else {
        localStorage.removeItem(this.storageKey);
      }
    } catch {}
  }

  adjustDirectionIfOverflowing(): void {
    const menu = this.menuWrapperRef.nativeElement as HTMLElement;
    const menuItems = menu.querySelector('.menu-items') as HTMLElement;
    if (!menuItems) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Try default direction first
    menuItems.classList.remove('left', 'right', 'up', 'down');
    menuItems.classList.add(this.direction);
    let rect = menuItems.getBoundingClientRect();
    let willOverflow = false;
    if (this.direction === 'right') willOverflow = rect.right > vw;
    if (this.direction === 'left') willOverflow = rect.left < 0;
    if (this.direction === 'up') willOverflow = rect.top < 0;
    if (this.direction === 'down') willOverflow = rect.bottom > vh;

    if (!willOverflow) {
      this.activeDirection.set(this.direction);
      return;
    }

    // Try opposite direction
    const opposite = {
      right: 'left',
      left: 'right',
      up: 'down',
      down: 'up'
    } as const;
    const altDirection = opposite[this.direction];
    menuItems.classList.remove('left', 'right', 'up', 'down');
    menuItems.classList.add(altDirection);
    rect = menuItems.getBoundingClientRect();
    let altOverflow = false;
    if (altDirection === 'right') altOverflow = rect.right > vw;
    if (altDirection === 'left') altOverflow = rect.left < 0;
    if (altDirection === 'up') altOverflow = rect.top < 0;
    if (altDirection === 'down') altOverflow = rect.bottom > vh;

    if (!altOverflow) {
      this.activeDirection.set(altDirection);
    } else {
      // If both overflow, use default
      this.activeDirection.set(this.direction);
    }
  }

  onMenuItemClick(item: any) {
    if (item.action) item.action();
    this.open.set(false);
    this._directionAdjusted = false;
  }
}
