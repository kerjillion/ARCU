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
        data: { title: 'Assessment' }
      },
      // Add more child routes here
      { path: '**', redirectTo: '' }
    ]
  }
];
