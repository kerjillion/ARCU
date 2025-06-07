import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assessments',
  standalone: true,
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent {
  assessmentId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.assessmentId = this.route.snapshot.paramMap.get('id');
    // Use this.assessmentId to fetch data from your repository
  }
}