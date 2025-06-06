import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FloatingMenuComponent } from './shared/floating-menu/floating-menu.component';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [RouterOutlet, FloatingMenuComponent],
  templateUrl: './frame.component.html',
  styleUrls: ['./app.scss']
})
export class FrameComponent {
  onHome = () => {
    console.log('Home clicked');
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

  // Set this to 'left' or 'right' depending on where your menu is anchored
  menuPosition: 'left' | 'right' = 'left'; // or 'right'

  menuItems = [
    { icon: 'home', label: 'Home', disabled: false, action: () => this.onHome() },
    { icon: 'assignment', label: 'Action required', disabled: false, action: () => this.onActionRequired() },
    { icon: 'how_to_reg', label: 'Registration', disabled: false, action: () => this.onRegistration() },
    { icon: 'assessment', label: 'Report Hub', disabled: false, action: () => this.onReportHub() },
    { icon: 'search', label: 'Custom Searches', disabled: false, action: () => this.onCustomSearches() },
    { icon: 'person', label: 'Profile', disabled: false, action: () => this.onProfile() },
    { icon: 'admin_panel_settings', label: 'Admin', disabled: false, action: () => this.onAdmin() },
    { icon: 'info', label: 'About this Application', disabled: false, action: () => this.onAbout() }
  ];
}