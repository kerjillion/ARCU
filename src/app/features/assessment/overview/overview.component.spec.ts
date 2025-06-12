import { render } from '@testing-library/angular';
import { AssessmentOverviewComponent } from './overview.component';

describe('AssessmentOverviewComponent', () => {
  it('should render the overview form', async () => {
    const { getByLabelText } = await render(AssessmentOverviewComponent);
    expect(getByLabelText('Title')).toBeTruthy();
    expect(getByLabelText('Objective')).toBeTruthy();
    expect(getByLabelText('Impact Summary')).toBeTruthy();
    expect(getByLabelText('Target Population')).toBeTruthy();
    expect(getByLabelText('Date 1')).toBeTruthy();
    expect(getByLabelText('Dropdown 1')).toBeTruthy();
    expect(getByLabelText('Input 4')).toBeTruthy();
    expect(getByLabelText('Spanning Dropdown 1')).toBeTruthy();
  });
});
