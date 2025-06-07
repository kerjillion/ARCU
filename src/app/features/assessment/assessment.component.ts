import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { FloatingMenuComponent } from '../../shared/floating-menu/floating-menu.component';

interface AssessmentTab {
  title: string;
  disabled: boolean;
  visible: boolean;
  order: number;
}

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [MatTabsModule, FloatingMenuComponent],
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent {
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
}