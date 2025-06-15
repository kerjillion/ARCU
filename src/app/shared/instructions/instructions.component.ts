import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class InstructionsComponent {
  @Input() text: string | string[] = '';

  get paragraphs(): string[] {
    if (Array.isArray(this.text)) {
      return this.text;
    }
    if (typeof this.text === 'string') {
      // Split on newlines or commas for robustness
      return this.text.split(/\n|(?<!\\),/).map(p => p.trim()).filter(Boolean);
    }
    return [];
  }
}
