import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
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
import { AssessmentStateService } from '../../core';
import { OverviewDataService, OverviewData } from './services/overview-data.service';

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

  selectedTabIndex = signal(0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentState: AssessmentStateService,
    private overviewDataService: OverviewDataService
  ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.assessmentId.set(id);
      if (id) {
        this.overviewDataService.getOverviewData(id).subscribe((data: OverviewData) => {
          this.assessmentTitle = data.title;
          // For demo, use select2 as status (adjust as needed)
          this.assessmentStatus = data.ancillaryInfo.select2 || 'Unknown';
          this.assessmentState.setAssessment({ id, name: data.title, status: this.assessmentStatus });
        });
      } else {
        this.assessmentState.clear();
      }
    });
    // Listen for tab query param
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab) {
        const idx = this.visibleTabs().findIndex(t => t.title.toLowerCase().replace(/\s+/g, '') === tab.toLowerCase().replace(/\s+/g, ''));
        if (idx >= 0) this.selectedTabIndex.set(idx);
      } else {
        this.selectedTabIndex.set(0);
      }
    });
  }

  onTabChange(index: number) {
    const tab = this.visibleTabs()[index];
    if (tab) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tab: tab.title.toLowerCase().replace(/\s+/g, '') },
        queryParamsHandling: 'merge',
      });
    }
    this.selectedTabIndex.set(index);
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