import { Routes } from '@angular/router';
import { FrameComponent } from './frame.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssessmentComponent } from './features/assessment/assessment.component';

export const routes: Routes = [
  {
    path: '',
    component: FrameComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full', data: { title: 'Dashboard' } },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
      },
      { path: 'assessments', component: AssessmentComponent, data: { title: 'Assessments' } },
      { path: 'assessments/:id', component: AssessmentComponent, data: { title: 'Assessments' } },
      // Add more child routes here
      { path: '**', redirectTo: '' }
    ]
  }
];
