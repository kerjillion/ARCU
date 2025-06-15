import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RibbonButton {
  name: string;
  icon?: string;
  disabled?: boolean;
  visible?: boolean;
  action?: () => void;
}

@Component({
  selector: 'app-button-ribbon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-ribbon.component.html',
  styleUrls: ['./button-ribbon.component.scss']
})
export class ButtonRibbonComponent {
  @Input() buttons: RibbonButton[] = [];
  @Output() buttonClick = new EventEmitter<RibbonButton>();

  onButtonClick(btn: RibbonButton) {
    if (btn.action) {
      btn.action();
    }
    this.buttonClick.emit(btn);
  }
}
