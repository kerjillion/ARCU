import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Subject, takeUntil } from 'rxjs';
import { OverviewDataService, OverviewData } from '../services/overview-data.service';
import { OverviewIdentityComponent } from './overview-identity/overview-identity.component';
import { OverviewVitalsComponent } from './overview-vitals/overview-vitals.component';
import { OverviewDatesComponent } from './overview-dates/overview-dates.component';
import { ActivatedRoute } from '@angular/router';
import { InstructionsComponent } from '../../../shared/instructions/instructions.component';

@Component({
  selector: 'app-assessment-overview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    OverviewIdentityComponent,
    OverviewDatesComponent,
    OverviewVitalsComponent,
    InstructionsComponent
  ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class AssessmentOverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private assessmentId: string = ''; // Store the assessment ID

  form = new FormGroup({
    title: new FormControl(''),
    objective: new FormControl(''),
    impactSummary: new FormControl(''),
    targetPopulation: new FormControl(''),
    date1: new FormControl<Date | null>(null),
    date2: new FormControl<Date | null>(null),
    date3: new FormControl<Date | null>(null),
    date4: new FormControl<Date | null>(null),
    date5: new FormControl<Date | null>(null),
    date6: new FormControl<Date | null>(null),
    ancillaryInput1: new FormControl(''),
    ancillarySelect1: new FormControl(''),
    ancillaryInput2: new FormControl(''),
    ancillarySelect2: new FormControl(''),
    ancillaryInput3: new FormControl(''),
    ancillaryInput4: new FormControl(''),
    ancillarySelectSpan: new FormControl(''),
    ancillaryChips: new FormControl<string[]>([]),
  });

  dropdownOptions: any = {};
  isLoading = false;

  dateFields = [
    { label: 'Project Start', name: 'date1' },
    { label: 'Planning Complete', name: 'date2' },
    { label: 'Phase 1 Complete', name: 'date3' },
    { label: 'Testing Complete', name: 'date4' },
    { label: 'Deployment', name: 'date5' },
    { label: 'Project Complete', name: 'date6' },
  ];

  constructor(private overviewDataService: OverviewDataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to route param changes for reactive updates
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const assessmentId = params.get('id') || '8675309'; // fallback default
        this.assessmentId = assessmentId;
        this.loadOverviewData(assessmentId);
      });
    this.loadDropdownOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private loadOverviewData(assessmentId: string): void {
    this.isLoading = true;
    this.overviewDataService.getOverviewData(assessmentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: OverviewData | null) => {
          if (data) {
            this.populateForm(data);
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading overview data:', error);
          this.isLoading = false;
        }
      });
  }

  private loadDropdownOptions(): void {
    this.overviewDataService.getDropdownOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (options: any) => {
          this.dropdownOptions = options;
        },
        error: (error: any) => {
          console.error('Error loading dropdown options:', error);
        }
      });
  }  private populateForm(data: OverviewData): void {
    const formData = {
      title: data.title,
      objective: data.objective,
      impactSummary: data.impactSummary,
      targetPopulation: data.targetPopulation,
      date1: data.dates.date1,
      date2: data.dates.date2,
      date3: data.dates.date3,
      date4: data.dates.date4,
      date5: data.dates.date5,
      date6: data.dates.date6,
      ancillaryInput1: data.ancillaryInfo.input1,
      ancillarySelect1: data.ancillaryInfo.select1,
      ancillaryInput2: data.ancillaryInfo.input2,
      ancillarySelect2: data.ancillaryInfo.select2,
      ancillaryInput3: data.ancillaryInfo.input3,
      ancillaryInput4: data.ancillaryInfo.input4,
      ancillarySelectSpan: data.ancillaryInfo.selectSpan,
      ancillaryChips: (data.ancillaryInfo as any).chips || [],
    };
    
    this.form.patchValue(formData);
  }

  onSave(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      const overviewData: OverviewData = {
        id: this.assessmentId || '',
        status: 'Draft', // Default status for new saves
        title: formData.title || '',
        objective: formData.objective || '',
        impactSummary: formData.impactSummary || '',
        targetPopulation: formData.targetPopulation || '',
        dates: {
          date1: formData.date1 ?? null,
          date2: formData.date2 ?? null,
          date3: formData.date3 ?? null,
          date4: formData.date4 ?? null,
          date5: formData.date5 ?? null,
          date6: formData.date6 ?? null
        },        ancillaryInfo: {
          input1: formData.ancillaryInput1 || '',
          select1: formData.ancillarySelect1 || '',
          input2: formData.ancillaryInput2 || '',
          select2: formData.ancillarySelect2 || '',
          input3: formData.ancillaryInput3 || '',
          input4: formData.ancillaryInput4 || '',
          selectSpan: formData.ancillarySelectSpan || '',
          chips: formData.ancillaryChips || []
        } as OverviewData['ancillaryInfo']
      };
      const assessmentId = 'mock-assessment-123';
      this.overviewDataService.saveOverviewData(assessmentId, overviewData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (savedData: OverviewData) => {
            console.log('Data saved successfully:', savedData);
          },
          error: (error: any) => {
            console.error('Error saving data:', error);
          }
        });
    }
  }
}