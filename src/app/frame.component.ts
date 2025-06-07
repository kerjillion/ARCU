import { Component } from '@angular/core';
import { RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { FloatingMenuComponent } from './shared/floating-menu/floating-menu.component';
import { SearchbarComponent } from './shared/searchbar/searchbar.component';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [RouterOutlet, FloatingMenuComponent, SearchbarComponent],
  templateUrl: './frame.component.html',
  styleUrls: ['./app.scss']
})
export class FrameComponent {
  pageTitle = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.route.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        return child;
      }),
      mergeMap(route => route?.data ?? []),
      map(data => data['title'] || '')
    ).subscribe(title => {
      this.pageTitle = title;
    });
  }

  onDashboard = () => {
    console.log('Home clicked');
    this.router.navigate(['']); // Navigates to the dashboard route
  };
  onJenny = () => {
    this.router.navigate(['assessments', '8675309']);
  };


  onProfile = () => {
    console.log('Profile clicked');
  };

  onActionRequired = () => {
    console.log('Action Required clicked');
  };

  onRegistration = () => {
    console.log('Registration clicked');
  };

  onReportHub = () => {
    console.log('Report Hub clicked');
  };

  onCustomSearches = () => {
    console.log('Custom Searches clicked');
  };

  onAdmin = () => {
    console.log('Admin clicked');
  };

  onAbout = () => {
    console.log('About this Application clicked');
  };

  onSearch(query: string) {
    // Handle the search query here
    console.log('Search:', query);
  }

  // Set this to 'left' or 'right' depending on where your menu is anchored
  menuPosition: 'left' | 'right' = 'left'; // or 'right'

  menuItems = [
    { icon: 'home', label: 'Dashboard', disabled: false, action: () => this.onDashboard() },
    { icon: 'phone', label: '8675309', disabled: false, action: () => this.onJenny() },
    { icon: 'assignment', label: 'Action required', disabled: true, action: () => this.onActionRequired() },
    { icon: 'how_to_reg', label: 'Registration', disabled: true, action: () => this.onRegistration() },
    { icon: 'assessment', label: 'Report Hub', disabled: true, action: () => this.onReportHub() },
    { icon: 'search', label: 'Custom Searches', disabled: true, action: () => this.onCustomSearches() },
    { icon: 'person', label: 'Profile', disabled: true, action: () => this.onProfile() },
    { icon: 'admin_panel_settings', label: 'Admin', disabled: true, action: () => this.onAdmin() },
    { icon: 'info', label: 'About this Application', disabled: true, action: () => this.onAbout() }
  ];
}