import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-overview-identity',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './overview-identity.component.html',
  styleUrls: ['./overview-identity.component.scss']
})
export class OverviewIdentityComponent {
  @Input() form!: FormGroup;
}
