import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Mock interfaces
interface Assessment {
  id: string;
  title: string;
  status: string;
  ownerId: string;
  stakeholders: string[];
}

interface Action {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'completed';
}

interface WaitingOn {
  assessmentId: string;
  assessmentTitle: string;
  user: string;
  actionDescription: string;
}

@Injectable({ providedIn: 'root' })
class AssessmentService {
  constructor(private http: HttpClient) {}
  getAllAssessments() {
    return this.http.get<Assessment[]>('assets/data/assessments.json');
  }
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  dashboardTitle = signal('Dashboard');
  allAssessments = signal<Assessment[]>([]);

  constructor(private assessmentService: AssessmentService) {
    this.assessmentService.getAllAssessments().subscribe(data => {
      this.allAssessments.set(data);
    });
  }

  getTabForAction(action: { description?: string; actionDescription?: string }): string {
    // Map action descriptions to tab names (customize as needed)
    const desc = (action.description || action.actionDescription || '').toLowerCase();
    if (desc.includes('review')) return 'overview';
    if (desc.includes('deploy')) return 'deployment';
    if (desc.includes('relationship')) return 'relationships';
    if (desc.includes('scope')) return 'scope';
    if (desc.includes('policy')) return 'policy';
    if (desc.includes('regulation')) return 'regulation';
    if (desc.includes('risk')) return 'risks';
    if (desc.includes('note')) return 'notes';
    if (desc.includes('pov')) return 'pov';
    return 'overview';
  }
}
