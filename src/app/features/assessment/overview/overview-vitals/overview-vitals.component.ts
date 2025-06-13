import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { SharedChipListComponent } from '../../../../shared/chip-list/chip-list.component';

@Component({
  selector: 'app-overview-vitals',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, SharedChipListComponent],
  templateUrl: './overview-vitals.component.html',
  styleUrls: ['./overview-vitals.component.scss']
})
export class OverviewVitalsComponent {
  @Input() form!: FormGroup;
  @Input() dropdownOptions: any;

  get phaseLabels(): string[] {
    return this.dropdownOptions?.phases?.map((p: any) => p.label) ?? [];
  }

  get ancillaryChips(): string[] {
    return this.form.get('ancillaryChips')?.value || [];
  }
  set ancillaryChips(value: string[]) {
    this.form.get('ancillaryChips')?.setValue(value);
  }
}
