import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface OverviewData {
  title: string;
  objective: string;
  impactSummary: string;
  targetPopulation: string;
  dates: {
    date1: Date | null;
    date2: Date | null;
    date3: Date | null;
    date4: Date | null;
    date5: Date | null;
    date6: Date | null;
  };
  ancillaryInfo: {
    input1: string;
    select1: string;
    input2: string;
    select2: string;
    input3: string;
    input4: string;
    selectSpan: string;
    chips: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class OverviewDataService {
  
  private mockData: OverviewData = {
    title: 'Digital Health Initiative',
    objective: 'Implement a comprehensive digital health platform to improve patient outcomes and streamline healthcare delivery processes across the organization.',
    impactSummary: 'Expected to reduce patient wait times by 30%, improve care coordination between departments, and enhance overall patient satisfaction scores.',
    targetPopulation: 'Primary care patients aged 18-65 with chronic conditions requiring ongoing monitoring and care management.',
    dates: {
      date1: new Date('2024-01-15'),
      date2: new Date('2024-03-30'),
      date3: new Date('2024-06-15'),
      date4: new Date('2024-09-01'),
      date5: new Date('2024-12-15'),
      date6: new Date('2025-03-30')
    },    ancillaryInfo: {
      input1: 'Budget Code: HC-2024-001',
      select1: 'high-priority',
      input2: 'Stakeholder: Dr. Sarah Johnson',
      select2: 'approved',
      input3: 'Department: IT Health Services',
      input4: 'Project Manager: Mike Chen',
      selectSpan: 'phase-1-implementation',
      chips: ['Planning Phase', 'Testing & Validation']
    }
  };

  /**
   * Get overview data for a specific assessment
   * @param assessmentId - The ID of the assessment
   * @returns Observable of OverviewData
   */
  getOverviewData(assessmentId: string): Observable<OverviewData> {
    // Simulate API call with delay
    return of(this.mockData).pipe(delay(500));
  }

  /**
   * Save overview data for a specific assessment
   * @param assessmentId - The ID of the assessment
   * @param data - The overview data to save
   * @returns Observable of the saved data
   */
  saveOverviewData(assessmentId: string, data: OverviewData): Observable<OverviewData> {
    // Simulate API call with delay
    this.mockData = { ...data };
    return of(this.mockData).pipe(delay(300));
  }

  /**
   * Get available options for dropdown fields
   * @returns Observable of dropdown options
   */
  getDropdownOptions(): Observable<{
    priorities: Array<{value: string, label: string}>;
    statuses: Array<{value: string, label: string}>;
    phases: Array<{value: string, label: string}>;
  }> {
    const options = {
      priorities: [
        { value: 'low-priority', label: 'Low Priority' },
        { value: 'medium-priority', label: 'Medium Priority' },
        { value: 'high-priority', label: 'High Priority' },
        { value: 'critical-priority', label: 'Critical Priority' }
      ],
      statuses: [
        { value: 'draft', label: 'Draft' },
        { value: 'under-review', label: 'Under Review' },
        { value: 'approved', label: 'Approved' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
      ],
      phases: [
        { value: 'planning', label: 'Planning Phase' },
        { value: 'phase-1-implementation', label: 'Phase 1 Implementation' },
        { value: 'phase-2-implementation', label: 'Phase 2 Implementation' },
        { value: 'testing', label: 'Testing & Validation' },
        { value: 'deployment', label: 'Deployment' },
        { value: 'post-deployment', label: 'Post-Deployment Support' }
      ]
    };

    return of(options).pipe(delay(200));
  }

  /**
   * Create a new empty overview data structure
   * @returns Empty OverviewData object
   */
  createEmptyOverviewData(): OverviewData {
    return {
      title: '',
      objective: '',
      impactSummary: '',
      targetPopulation: '',
      dates: {
        date1: null,
        date2: null,
        date3: null,
        date4: null,
        date5: null,
        date6: null
      },
      ancillaryInfo: {
        input1: '',
        select1: '',
        input2: '',
        select2: '',
        input3: '',
        input4: '',
        selectSpan: '',
        chips: []
      }
    };
  }
}