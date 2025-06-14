import { render } from '@testing-library/angular';
import { AssessmentOverviewComponent } from './overview.component';
import { OverviewDataService } from '../services/overview-data.service';
import { of } from 'rxjs';

describe('AssessmentOverviewComponent', () => {
  it('should render the overview form', async () => {
    const mockOverviewDataService = {
      getOverviewData: jest.fn().mockReturnValue(of({
        title: 'Test Title',
        objective: 'Test Objective',
        impactSummary: 'Test Impact',
        targetPopulation: 'Test Population',
        dates: {
          date1: new Date('2024-01-15'),
          date2: null,
          date3: null,
          date4: null,
          date5: null,
          date6: null
        },
        ancillaryInfo: {
          input1: 'Test Input 1',
          select1: 'high-priority',
          input2: 'Test Input 2',
          select2: 'approved',
          input3: 'Test Input 3',
          input4: 'Test Input 4',
          selectSpan: 'phase-1-implementation',
          chips: ['Test Chip']
        }
      })),
      getDropdownOptions: jest.fn().mockReturnValue(of({
        priorities: [{ value: 'high-priority', label: 'High Priority' }],
        statuses: [{ value: 'approved', label: 'Approved' }],
        phases: [{ value: 'phase-1-implementation', label: 'Phase 1 Implementation' }]
      }))
    };

    const { getByLabelText } = await render(AssessmentOverviewComponent, {
      providers: [
        { provide: OverviewDataService, useValue: mockOverviewDataService }
      ]
    });

    expect(getByLabelText('Title')).toBeTruthy();
    expect(getByLabelText('Objective')).toBeTruthy();
    expect(getByLabelText('Impact Summary')).toBeTruthy();
    expect(getByLabelText('Target Population')).toBeTruthy();
    expect(getByLabelText('Input 4')).toBeTruthy();
  });
});
