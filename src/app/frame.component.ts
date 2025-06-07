import { Component, computed, signal, effect } from '@angular/core';
import { RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
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
  // Reactive page title using signal
  readonly pageTitle = signal('');

  // Reactive menu items
  readonly menuItems = signal([
    { icon: 'home', label: 'Dashboard', disabled: false, action: () => this.onDashboard() },
    { icon: 'phone', label: '8675309', disabled: false, action: () => this.onJenny() },
    { icon: 'assignment', label: 'Action required', disabled: true, action: () => this.onActionRequired() },
    { icon: 'how_to_reg', label: 'Registration', disabled: true, action: () => this.onRegistration() },
    { icon: 'assessment', label: 'Report Hub', disabled: true, action: () => this.onReportHub() },
    { icon: 'search', label: 'Custom Searches', disabled: true, action: () => this.onCustomSearches() },
    { icon: 'person', label: 'Profile', disabled: true, action: () => this.onProfile() },
    { icon: 'admin_panel_settings', label: 'Admin', disabled: true, action: () => this.onAdmin() },
    { icon: 'info', label: 'About this Application', disabled: true, action: () => this.onAbout() }
  ]);

  // Reactive search query
  readonly searchQuery = signal('');

  constructor(private router: Router, private route: ActivatedRoute) {
    const title$ = this.router.events.pipe(
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
    );
    // Convert observable to signal
    const titleSignal = toSignal(title$, { initialValue: '' });
    effect(() => this.pageTitle.set(titleSignal()));
  }

  onDashboard = () => {
    this.router.navigate(['']);
  };
  onJenny = () => {
    this.router.navigate(['assessment', '8675309']);
  };
  onProfile = () => {};
  onActionRequired = () => {};
  onRegistration = () => {};
  onReportHub = () => {};
  onCustomSearches = () => {};
  onAdmin = () => {};
  onAbout = () => {};

  onSearch(query: string) {
    this.searchQuery.set(query);
    // Handle the search query reactively as needed
  }

  // Set this to 'left' or 'right' depending on where your menu is anchored
  menuPosition: 'left' | 'right' = 'left';
}