import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { SharedChipListComponent } from '../../../../shared/chip-list/chip-list.component';

@Component({
  selector: 'app-overview-vitals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, SharedChipListComponent],
  templateUrl: './overview-vitals.component.html',
  styleUrls: ['./overview-vitals.component.scss']
})
export class OverviewVitalsComponent {
  @Input() form!: FormGroup;
  @Input() dropdownOptions: any;

  get phaseLabels(): string[] {
    return this.dropdownOptions?.phases?.map((p: any) => p.label) ?? [];
  }
}
