import { Injectable } from '@angular/core';
import { Observable, of, delay, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface OverviewData {
  id: string;
  title: string;
  status: string;
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
  constructor(private http: HttpClient) {}

  /**
   * Get overview data for a specific assessment
   * @param assessmentId - The ID of the assessment
   * @returns Observable of OverviewData
   */  getOverviewData(assessmentId: string): Observable<OverviewData | null> {
    // Simulate a slower API by delaying BEFORE the HTTP request
    return of(null).pipe(
      delay(500), // This creates the delay that the interceptor will track
      switchMap(() => this.http.get<OverviewData[]>('assets/data/assessments.json')),
      map(list => {
        // Convert date strings to Date objects
        const found = list.find(item => item.id === assessmentId);
        if (found) {
          const dates = found.dates;
          return {
            ...found,
            dates: {
              date1: dates.date1 ? new Date(dates.date1) : null,
              date2: dates.date2 ? new Date(dates.date2) : null,
              date3: dates.date3 ? new Date(dates.date3) : null,
              date4: dates.date4 ? new Date(dates.date4) : null,
              date5: dates.date5 ? new Date(dates.date5) : null,
              date6: dates.date6 ? new Date(dates.date6) : null,
            }
          };
        }        return null;
      })
    );
  }

  /**
   * Save overview data for a specific assessment
   * @param assessmentId - The ID of the assessment
   * @param data - The overview data to save
   * @returns Observable of the saved data
   */
  saveOverviewData(assessmentId: string, data: OverviewData): Observable<OverviewData> {    // Simulate API call with delay (no actual save in assets)
    return of(data).pipe(delay(800)); // Increased delay
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
        { value: 'Draft', label: 'Draft' },
        { value: 'Under Review', label: 'Under Review' },
        { value: 'Approved', label: 'Approved' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' }
      ],
      phases: [
        { value: 'planning', label: 'Planning Phase' },
        { value: 'phase-1-implementation', label: 'Phase 1 Implementation' },
        { value: 'phase-2-implementation', label: 'Phase 2 Implementation' },
        { value: 'security-assessment', label: 'Security Assessment' },
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
      id: '',
      title: '',
      status: '',
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