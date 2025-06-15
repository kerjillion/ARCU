import { Component } from '@angular/core';
import { StandardGridSectionComponent } from "../../../shared/standard-grid-section/standard-grid-section.component";
import { InstructionsComponent } from "../../../shared/instructions/instructions.component";

@Component({
  selector: 'app-assessment-stakeholders',
  standalone: true,
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.scss'],
  imports: [StandardGridSectionComponent, InstructionsComponent]
})
export class AssessmentStakeholdersComponent {

}
