import { render } from '@testing-library/angular';
import { AssessmentNotesComponent } from './notes.component';

describe('AssessmentNotesComponent', () => {
  it('should render the notes title and details', async () => {
    const { getByText } = await render(AssessmentNotesComponent);
    expect(getByText('Notes')).toBeTruthy();
    expect(getByText('Notes details go here.')).toBeTruthy();
  });
});
