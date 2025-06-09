import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Injectable } from '@angular/core';

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
  private assessments: Assessment[] = [
    { id: '1', title: 'Risk Assessment 1', status: 'In Progress', ownerId: 'user1', stakeholders: ['user1', 'user2'] },
    { id: '2', title: 'Compliance Review', status: 'Pending', ownerId: 'user2', stakeholders: ['user2', 'user3'] },
    { id: '3', title: 'Security Audit', status: 'Completed', ownerId: 'user1', stakeholders: ['user1', 'user3'] },
  ];
  private actions: Action[] = [
    { id: 'a1', assessmentId: '1', assessmentTitle: 'Risk Assessment 1', description: 'Review findings', assignedTo: 'user1', status: 'pending' },
    { id: 'a2', assessmentId: '2', assessmentTitle: 'Compliance Review', description: 'Submit documents', assignedTo: 'user3', status: 'pending' },
    { id: 'a3', assessmentId: '3', assessmentTitle: 'Security Audit', description: 'Approve audit', assignedTo: 'user1', status: 'completed' },
    { id: 'a4', assessmentId: '1', assessmentTitle: 'Risk Assessment 1', description: 'Provide feedback', assignedTo: 'user2', status: 'pending' },
  ];
  getAssessmentsForStakeholder(userId: string): Assessment[] {
    return this.assessments.filter(a => a.stakeholders.includes(userId));
  }
  getActionsForUser(userId: string): Action[] {
    return this.actions.filter(a => a.assignedTo === userId && a.status === 'pending');
  }
  getWaitingOnOthersForOwner(userId: string): WaitingOn[] {
    const owned = this.assessments.filter(a => a.ownerId === userId);
    const ownedIds = owned.map(a => a.id);
    return this.actions
      .filter(a => ownedIds.includes(a.assessmentId) && a.assignedTo !== userId && a.status === 'pending')
      .map(a => ({
        assessmentId: a.assessmentId,
        assessmentTitle: a.assessmentTitle,
        user: a.assignedTo,
        actionDescription: a.description
      }));
  }
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AssessmentService]
})
export class DashboardComponent {
  dashboardTitle = signal('Dashboard');
  myAssessments = signal<Assessment[]>([]);
  myActions = signal<Action[]>([]);
  waitingOnOthers = signal<WaitingOn[]>([]);

  constructor(private assessmentService: AssessmentService) {
    // Replace 'user1' with actual user id from auth service in real app
    const userId = 'user1';
    this.myAssessments.set(this.assessmentService.getAssessmentsForStakeholder(userId));
    this.myActions.set(this.assessmentService.getActionsForUser(userId));
    this.waitingOnOthers.set(this.assessmentService.getWaitingOnOthersForOwner(userId));
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
