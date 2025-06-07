import { Component, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  template: `
    <form class="searchbar" (submit)="onSubmit($event)">
      <input
        type="text"
        [ngModel]="query()"
        (ngModelChange)="query.set($event)"
        name="search"
        placeholder="Search..."
        class="searchbar-input"
        autocomplete="off"
      />
      <button type="submit" class="searchbar-btn" aria-label="Search">
        <mat-icon>search</mat-icon>
      </button>
    </form>
  `,
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent {
  readonly query = signal('');
  @Output() search = new EventEmitter<string>();

  onSubmit(event: Event) {
    event.preventDefault();
    this.search.emit(this.query().trim());
  }
}