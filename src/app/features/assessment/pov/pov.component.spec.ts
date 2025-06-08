import { render } from '@testing-library/angular';
import { AssessmentPovComponent } from './pov.component';

describe('AssessmentPovComponent', () => {
  it('should render the POV title and details', async () => {
    const { getByText } = await render(AssessmentPovComponent);
    expect(getByText('POV')).toBeTruthy();
    expect(getByText('POV details go here.')).toBeTruthy();
  });
});
