import { Routes } from '@angular/router';
import { FrameComponent } from './frame.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: FrameComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full', data: { title: 'Dashboard' } },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'assessment/:id',
        loadComponent: () => import('./features/assessment/assessment.component').then(m => m.AssessmentComponent),
        data: { title: 'Assessment' },
        children: [
          {
            path: 'overview',
            loadComponent: () => import('./features/assessment/overview/overview.component').then(m => m.AssessmentOverviewComponent),
          },
          {
            path: 'notes',
            loadComponent: () => import('./features/assessment/notes/notes.component').then(m => m.AssessmentNotesComponent),
          },
          {
            path: 'stakeholders',
            loadComponent: () => import('./features/assessment/stakeholders/stakeholders.component').then(m => m.AssessmentStakeholdersComponent),
          },
          {
            path: 'scope',
            loadComponent: () => import('./features/assessment/scope/scope.component').then(m => m.AssessmentScopeComponent),
          },
          {
            path: 'risks',
            loadComponent: () => import('./features/assessment/risks/risks.component').then(m => m.AssessmentRisksComponent),
          },
          {
            path: 'risk-list',
            loadComponent: () => import('./features/assessment/risk-list/risk-list.component').then(m => m.AssessmentRiskListComponent),
          },
          {
            path: 'relationships',
            loadComponent: () => import('./features/assessment/relationships/relationships.component').then(m => m.AssessmentRelationshipsComponent),
          },
          {
            path: 'regulation',
            loadComponent: () => import('./features/assessment/regulation/regulation.component').then(m => m.AssessmentRegulationComponent),
          },
          {
            path: 'pov',
            loadComponent: () => import('./features/assessment/pov/pov.component').then(m => m.AssessmentPovComponent),
          },
          {
            path: 'policy',
            loadComponent: () => import('./features/assessment/policy/policy.component').then(m => m.AssessmentPolicyComponent),
          },
          {
            path: 'deployment',
            loadComponent: () => import('./features/assessment/deployment/deployment.component').then(m => m.AssessmentDeploymentComponent),
          },
        ]
      },
      // Add more child routes here
      { path: '**', redirectTo: '' }
    ]
  }
];
