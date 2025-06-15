import { Component } from '@angular/core';

@Component({
  selector: 'app-assessment-stakeholders',
  standalone: true,
  template: `
    <div class="assessment-stakeholders">
      <h2>Stakeholders</h2>
      <p>List and manage stakeholders for this assessment here.</p>
    </div>
  `,
  styleUrls: ['./stakeholders.component.scss']
})
export class AssessmentStakeholdersComponent {}
