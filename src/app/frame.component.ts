import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="app-header">
      <h1>ARCU</h1>
    </header>
    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.scss']
})
export class FrameComponent {}