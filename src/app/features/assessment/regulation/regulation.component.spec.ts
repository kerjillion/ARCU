import { render } from '@testing-library/angular';
import { AssessmentRegulationComponent } from './regulation.component';

describe('AssessmentRegulationComponent', () => {
  it('should render the regulation title and details', async () => {
    const { getByText } = await render(AssessmentRegulationComponent);
    expect(getByText('Regulation')).toBeTruthy();
    expect(getByText('Regulation details go here.')).toBeTruthy();
  });
});
