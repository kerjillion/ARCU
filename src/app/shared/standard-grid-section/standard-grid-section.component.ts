import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-standard-grid-section',
  standalone: true,
  templateUrl: './standard-grid-section.component.html',
  styleUrls: ['./standard-grid-section.component.scss'],
  imports: [CommonModule]
})
export class StandardGridSectionComponent {
  @Input() header: string = '';
  @Input() instructions: string = '';

  hasProjectedInstructions(): boolean {
    // This is a placeholder for future logic if you want to detect projected content
    return false;
  }
}
