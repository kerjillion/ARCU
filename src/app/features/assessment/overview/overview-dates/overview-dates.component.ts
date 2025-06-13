import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-overview-dates',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './overview-dates.component.html',
  styleUrls: ['./overview-dates.component.scss']
})
export class OverviewDatesComponent {
  @Input() form!: FormGroup;
}
