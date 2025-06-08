import { render } from '@testing-library/angular';
import { AssessmentRisksComponent } from './risks.component';

describe('AssessmentRisksComponent', () => {
  it('should render the risks title and details', async () => {
    const { getByText } = await render(AssessmentRisksComponent);
    expect(getByText('Risks')).toBeTruthy();
    expect(getByText('Risks details go here.')).toBeTruthy();
  });
});
