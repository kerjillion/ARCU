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

  menuItems = [
    { icon: 'home', label: 'Home', action: () => this.onHome() },
    { icon: 'person', label: 'Profile', action: () => this.onProfile() }
  ];
}