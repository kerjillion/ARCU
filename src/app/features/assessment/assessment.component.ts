import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { AssessmentStakeholdersComponent } from './stakeholders/stakeholders.component';
import { CommonModule } from '@angular/common';
import { ButtonRibbonComponent, RibbonButton } from "../../shared/button-ribbon/button-ribbon.component";

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
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    AssessmentOverviewComponent,
    AssessmentDeploymentComponent,
    AssessmentRelationshipsComponent,
    AssessmentScopeComponent,
    AssessmentPolicyComponent,
    AssessmentRegulationComponent,
    AssessmentRisksComponent,
    AssessmentRiskListComponent,
    AssessmentNotesComponent,
    AssessmentPovComponent,
    AssessmentStakeholdersComponent,
    ButtonRibbonComponent
],
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent {
openAttachementsPanel() {
  // TODO: Implement attachments panel
  console.log('Opening attachments panel');
}
  readonly assessmentId = signal<string | null>(null);

  // Signal for tab definitions
  readonly tabs = signal<AssessmentTab[]>([
    { title: 'Overview',  disabled: false, visible: true,  order: 1 },
    { title: 'Deployments',  disabled: false, visible: true,  order: 2 },
    { title: 'Relationships',  disabled: false, visible: true,  order: 3 },
    { title: 'Stakeholders',  disabled: false, visible: true,  order: 4 },
    { title: 'Scope',  disabled: true, visible: true,  order: 5 },
    { title: 'Policies',  disabled: true, visible: true,  order: 6 },
    { title: 'Regulations',  disabled: true, visible: true,  order: 7 },
    { title: 'Risks',  disabled: true, visible: true,  order: 8 },
    { title: 'Risk List',  disabled: true, visible: true,  order: 9 },
    { title: 'Notes',  disabled: true, visible: true,  order: 10 },
    { title: 'POV', disabled: true, visible: true,  order: 11 },
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
      if (id) {        this.overviewDataService.getOverviewData(id).subscribe((data: OverviewData | null) => {
          if (data) {
            this.assessmentTitle.set(data.title);
            this.assessmentStatus.set(data.status || 'Unknown');
            this.assessmentState.setAssessment({ id, name: data.title, status: this.assessmentStatus() });
          }
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

  // Sliding panel properties
  isPanelOpen = signal(false);
  panelTitle = signal('');
  openPanel(title: string) {
    // If panel is open and same title, close it
    if (this.isPanelOpen() && this.panelTitle() === title) {
      this.closePanel();
    } else {
      // Otherwise open/switch to new panel
      this.panelTitle.set(title);
      this.isPanelOpen.set(true);
    }
  }
  closePanel() {
    this.isPanelOpen.set(false);
  }

  assessmentTitle = signal('Assessment Title Here'); // Replace with actual title
  assessmentStatus = signal('In Progress'); // Replace with actual status

  trackByTitle(index: number, tab: { title: string }) {
    return tab.title;
  }

    ribbonButtons: RibbonButton[] = [
    { name: 'Send', icon: 'send', visible: true },
    { name: 'Check Out', icon: 'logout', visible: true, disabled: true },
    { name: 'Approve', icon: 'check_circle', visible: true, disabled: true },
    { name: 'Reject', icon: 'cancel', visible: true, disabled: true },
    { name: 'Complete', icon: 'done_all', visible: true, disabled: true },
    { name: 'Cancel', icon: 'close', visible: true },
    { name: 'Save', icon: 'save', visible: true }
  ];

  onRibbonButtonClick(btn: RibbonButton) {
    // Handle button click here, e.g., context-aware logic
    console.log('Ribbon button clicked:', btn);
  }
}