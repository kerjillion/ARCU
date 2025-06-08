import { render } from '@testing-library/angular';
import { AssessmentDeploymentComponent } from './deployment.component';

describe('AssessmentDeploymentComponent', () => {
  it('should render the deployment title and details', async () => {
    const { getByText } = await render(AssessmentDeploymentComponent);
    expect(getByText('Deployment')).toBeTruthy();
    expect(getByText('Deployment details go here.')).toBeTruthy();
  });
});
