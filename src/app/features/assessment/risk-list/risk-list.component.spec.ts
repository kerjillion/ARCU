import { render } from '@testing-library/angular';
import { AssessmentRiskListComponent } from './risk-list.component';

describe('AssessmentRiskListComponent', () => {
  it('should render the risk list title and details', async () => {
    const { getByText } = await render(AssessmentRiskListComponent);
    expect(getByText('Risk List')).toBeTruthy();
    expect(getByText('Risk list details go here.')).toBeTruthy();
  });
});
