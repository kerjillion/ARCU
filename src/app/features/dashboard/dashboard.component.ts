import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-container">
      <h2>{{ dashboardTitle() }}</h2>
      <div class="dashboard-widgets">
        <div class="dashboard-widget">
          <h3>Quick Links</h3>
          <ul>
            <li><a routerLink="/action-required">Action Required</a></li>
            <li><a routerLink="/registration">Registration</a></li>
            <li><a routerLink="/report-hub">Report Hub</a></li>
            <li><a routerLink="/custom-searches">Custom Searches</a></li>
            <li><a routerLink="/admin">Admin</a></li>
          </ul>
        </div>
        <div class="dashboard-widget">
          <h3>Recent Activity</h3>
          <p>No recent activity.</p>
        </div>
        <div class="dashboard-widget">
          <h3>About</h3>
          <p>This is the ARCU dashboard. Use the menu to navigate through the application features.</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  dashboardTitle = signal('Dashboard');
}
