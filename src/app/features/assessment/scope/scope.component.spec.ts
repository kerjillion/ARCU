import { render } from '@testing-library/angular';
import { AssessmentScopeComponent } from './scope.component';

describe('AssessmentScopeComponent', () => {
  it('should render the scope title and details', async () => {
    const { getByText } = await render(AssessmentScopeComponent);
    expect(getByText('Scope')).toBeTruthy();
    expect(getByText('Scope details go here.')).toBeTruthy();
  });
});
