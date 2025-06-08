import { render } from '@testing-library/angular';
import { AssessmentPolicyComponent } from './policy.component';

describe('AssessmentPolicyComponent', () => {
  it('should render the policy title and details', async () => {
    const { getByText } = await render(AssessmentPolicyComponent);
    expect(getByText('Policy')).toBeTruthy();
    expect(getByText('Policy details go here.')).toBeTruthy();
  });
});
