import { render } from '@testing-library/angular';
import { AssessmentOverviewComponent } from './overview.component';

describe('AssessmentOverviewComponent', () => {
  it('should render the overview title and details', async () => {
    const { getByText } = await render(AssessmentOverviewComponent);
    expect(getByText('Overview')).toBeTruthy();
    expect(getByText('Overview details go here.')).toBeTruthy();
  });
});
