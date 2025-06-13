import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-shared-chip-list',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss']
})
export class SharedChipListComponent {
  @Input() availableOptions: string[] = [];
  @Input() selected: string[] = [];
  @Input() allowFreeform: boolean = true;
  @Output() selectedChange = new EventEmitter<string[]>();

  chipCtrl = new FormControl('');
  filteredOptions: Observable<string[]>;

  constructor() {
    this.filteredOptions = this.chipCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => this._filter(value))
    );
  }
  addChip(event: any): void {
    const input = event.input;
    const value = event.value?.trim();
    if (value && !this.selected.includes(value)) {
      // Only allow additions if freeform is enabled OR value is in available options
      if (this.allowFreeform || this.availableOptions.includes(value)) {
        this.selected.push(value);
        this.selectedChange.emit(this.selected);
      }
    }
    if (input) input.value = '';
    this.chipCtrl.setValue('');
  }

  removeChip(chip: string): void {
    const index = this.selected.indexOf(chip);
    if (index >= 0) {
      this.selected.splice(index, 1);
      this.selectedChange.emit(this.selected);
    }
  }

  selectOption(event: any): void {
    const value = event.option.value;
    if (value && !this.selected.includes(value)) {
      this.selected.push(value);
      this.selectedChange.emit(this.selected);
    }
    this.chipCtrl.setValue('');
  }  onInputFocus(): void {
    // Trigger the autocomplete panel to open by ensuring there are options
    if (!this.chipCtrl.value) {
      this.chipCtrl.setValue(' ');
      setTimeout(() => this.chipCtrl.setValue(''), 0);
    }
  }

  onInputKeydown(event: KeyboardEvent): void {
    // Prevent typing when allowFreeform is false, but allow navigation keys
    if (!this.allowFreeform) {
      const allowedKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab', 'Backspace', 'Delete'];
      if (!allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }
  }

  private _filter(value: string | null): string[] {
    if (value === null || value === undefined || value === '' || value.trim() === '') {
      return this.availableOptions.filter(option => !this.selected.includes(option));
    }
    const filterValue = value.toLowerCase();
    return this.availableOptions.filter(option =>
      option.toLowerCase().includes(filterValue) && !this.selected.includes(option)
    );
  }
}

/**
 * SharedChipListComponent
 * 
 * A reusable Angular Material chip list component that supports autocomplete selection
 * and optional freeform text input.
 * 
 * @example
 * ```html
 * <!-- Basic usage with freeform input allowed -->
 * <app-shared-chip-list
 *   [availableOptions]="['Option 1', 'Option 2', 'Option 3']"
 *   [(selected)]="selectedItems">
 * </app-shared-chip-list>
 * 
 * <!-- Restricted to predefined options only -->
 * <app-shared-chip-list
 *   [availableOptions]="phaseOptions"
 *   [(selected)]="selectedPhases"
 *   [allowFreeform]="false">
 * </app-shared-chip-list>
 * ```
 * 
 * @input availableOptions - Array of string options that appear in the autocomplete dropdown
 * @input selected - Array of currently selected chip values (supports two-way binding)
 * @input allowFreeform - Whether users can type custom values (default: true)
 * @output selectedChange - Emitted when the selected chips array changes
 * 
 * Features:
 * - Autocomplete dropdown with filtering
 * - Chip removal with cancel buttons
 * - Horizontal chip layout with wrapping
 * - Keyboard navigation support
 * - Optional freeform input restriction
 * - Click-to-open dropdown behavior
 * 
 * When allowFreeform=false:
 * - Users can only select from availableOptions
 * - Typing is prevented but dropdown navigation works
 * - Click to open dropdown is still available
 */
