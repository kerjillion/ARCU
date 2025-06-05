import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./frame.component').then(m => m.FrameComponent),
    children: [
      // Example child route for home/landing page
      // {
      //   path: '',
      //   loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
      // },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
      },
      // Add more child routes here
    ]
  },
  { path: '**', redirectTo: '' }
];
