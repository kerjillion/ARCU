import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assessments',
  standalone: true,
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent {
  // Signal for the route param 'id'
  readonly assessmentId = signal<string | null>(null);

  constructor(private route: ActivatedRoute) {
    // Make the component reactive to route param changes
    this.route.paramMap.subscribe(params => {
      this.assessmentId.set(params.get('id'));
      // You can reactively fetch data here if needed
    });
  }

  // Example: computed signal for displaying or fetching data
  readonly displayId = computed(() => this.assessmentId());
}