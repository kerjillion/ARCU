import { render } from '@testing-library/angular';
import { AssessmentRelationshipsComponent } from './relationships.component';

describe('AssessmentRelationshipsComponent', () => {
  it('should render the relationships title and details', async () => {
    const { getByText } = await render(AssessmentRelationshipsComponent);
    expect(getByText('Relationships')).toBeTruthy();
    expect(getByText('Relationships details go here.')).toBeTruthy();
  });
});
