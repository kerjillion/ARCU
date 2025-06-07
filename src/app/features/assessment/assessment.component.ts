import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { FloatingMenuComponent } from '../../shared/floating-menu/floating-menu.component';
import { AssessmentOverviewComponent } from './overview/overview.component';
import { AssessmentDeploymentComponent } from './deployment/deployment.component';
import { AssessmentRelationshipsComponent } from './relationships/relationships.component';
import { AssessmentScopeComponent } from './scope/scope.component';
import { AssessmentPolicyComponent } from './policy/policy.component';
import { AssessmentRegulationComponent } from './regulation/regulation.component';
import { AssessmentRisksComponent } from './risks/risks.component';
import { AssessmentRiskListComponent } from './risk-list/risk-list.component';
import { AssessmentNotesComponent } from './notes/notes.component';
import { AssessmentPovComponent } from './pov/pov.component';

interface AssessmentTab {
  title: string;
  disabled: boolean;
  visible: boolean;
  order: number;
}

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [
    MatTabsModule,
    FloatingMenuComponent,
    AssessmentOverviewComponent,
    AssessmentDeploymentComponent,
    AssessmentRelationshipsComponent,
    AssessmentScopeComponent,
    AssessmentPolicyComponent,
    AssessmentRegulationComponent,
    AssessmentRisksComponent,
    AssessmentRiskListComponent,
    AssessmentNotesComponent,
    AssessmentPovComponent
  ],
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent {
openAttachementsPanel() {
throw new Error('Method not implemented.');
}
  readonly assessmentId = signal<string | null>(null);

  // Signal for tab definitions
  readonly tabs = signal<AssessmentTab[]>([
    { title: 'Overview',  disabled: false, visible: true,  order: 1 },
    { title: 'Deployment',  disabled: false, visible: true,  order: 2 },
    { title: 'Relationships',  disabled: false, visible: true,  order: 3 },
    { title: 'Scope',  disabled: false, visible: true,  order: 4 },
    { title: 'Policy',  disabled: false, visible: true,  order: 5 },
    { title: 'Regulation',  disabled: false, visible: true,  order: 6 },
    { title: 'Risks',  disabled: false, visible: true,  order: 7 },
    { title: 'Risk List',  disabled: false, visible: true,  order: 8 },
    { title: 'Notes',  disabled: false, visible: true,  order: 9 },
    { title: 'POV', disabled: false, visible: true,  order: 10 },
  ]);

  // Computed signal for visible and ordered tabs
  readonly visibleTabs = computed(() =>
    this.tabs()
      .filter(tab => tab.visible)
      .sort((a, b) => a.order - b.order)
  );

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.assessmentId.set(params.get('id'));
    });
  }

  readonly displayId = computed(() => this.assessmentId());

  logMenuItems = [
    { icon: 'assignment', label: 'Status Log', disabled: false, action: () => this.onLogMenu('status') },
    { icon: 'edit', label: 'Edit Log', disabled: false, action: () => this.onLogMenu('edit') },
    { icon: 'cloud_upload', label: 'Deployment Log', disabled: false, action: () => this.onLogMenu('deployment') }
  ];

  onLogMenu(type: string) {
    // TODO: Implement log menu action handling
    console.log('Log menu selected:', type);
  }

  isReportsPanelOpen = false; // Add this property to control the panel

  openReportsPanel() {
    this.isReportsPanelOpen = true;
  }

  // Optionally, add a method to close the panel
  closeReportsPanel() {
    this.isReportsPanelOpen = false;
  }

  assessmentTitle = 'Assessment Title Here'; // Replace with actual title
  assessmentStatus = 'In Progress'; // Replace with actual status
}