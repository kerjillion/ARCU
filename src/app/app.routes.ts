import { Routes } from '@angular/router';
import { FrameComponent } from './frame.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
      // Add more child routes here
      { path: '**', redirectTo: '' }
    ]
  }
];
