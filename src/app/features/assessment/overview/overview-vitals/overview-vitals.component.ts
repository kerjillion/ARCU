import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-vitals',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './overview-vitals.component.html',
  styleUrls: ['./overview-vitals.component.scss']
})
export class OverviewVitalsComponent {
  @Input() form!: FormGroup;
  @Input() dropdownOptions: any;
}
