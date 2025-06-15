import { Component } from '@angular/core';
import { StandardGridSectionComponent } from '../../../shared/standard-grid-section/standard-grid-section.component';
import { InstructionsComponent } from "../../../shared/instructions/instructions.component";

@Component({
  selector: 'app-assessment-relationships',
  standalone: true,
  imports: [StandardGridSectionComponent, InstructionsComponent],
  templateUrl: './relationships.component.html',
  styleUrls: ['./relationships.component.scss']
})
export class AssessmentRelationshipsComponent {}
