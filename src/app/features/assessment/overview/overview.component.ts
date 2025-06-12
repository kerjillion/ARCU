import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-assessment-overview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class AssessmentOverviewComponent {
  form = new FormGroup({
    title: new FormControl(''),
    objective: new FormControl(''),
    impactSummary: new FormControl(''),
    targetPopulation: new FormControl(''),
    date1: new FormControl(''),
    date2: new FormControl(''),
    date3: new FormControl(''),
    date4: new FormControl(''),
    date5: new FormControl(''),
    date6: new FormControl(''),
    ancillaryInput1: new FormControl(''),
    ancillarySelect1: new FormControl(''),
    ancillaryInput2: new FormControl(''),
    ancillarySelect2: new FormControl(''),
    ancillaryInput3: new FormControl(''),
    ancillaryInput4: new FormControl(''),
    ancillarySelectSpan: new FormControl(''),
  });

  dateFields = [
    { label: 'Date 1', name: 'date1' },
    { label: 'Date 2', name: 'date2' },
    { label: 'Date 3', name: 'date3' },
    { label: 'Date 4', name: 'date4' },
    { label: 'Date 5', name: 'date5' },
    { label: 'Date 6', name: 'date6' },
  ];
}