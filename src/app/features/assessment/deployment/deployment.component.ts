import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

interface Deployment {
  number: number;
  title: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
  assessmentId: number;
}

@Component({
  selector: 'app-assessment-deployment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatIconModule],
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.scss']
})
export class AssessmentDeploymentComponent implements OnInit {
  @Input() assessmentId!: number;
  @Input() assessmentTitle: string = '';

  deployments: Deployment[] = [];

  deploymentTypes: string[] = ['Initial', 'Follow-up', 'Final', 'Other'];
  deploymentStatuses: string[] = ['Active', 'Scheduled', 'Completed', 'Cancelled'];

  editIndex: number | null = null;
  editDeployment: Deployment | null = null;

  async ngOnInit() {
    const response = await fetch('assets/data/deployments.json');
    this.deployments = await response.json();
  }

  startEdit(index: number, deployment: Deployment) {
    this.editIndex = index;
    this.editDeployment = { ...deployment };
  }

  saveEdit(index: number) {
    if (this.editDeployment) {
      // Find the index in the original deployments array
      const globalIndex = this.deployments.findIndex(
        d => d.assessmentId === this.assessmentId && d.number === this.filteredDeployments[index].number
      );
      if (globalIndex !== -1) {
        this.deployments[globalIndex] = { ...this.editDeployment };
      }
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editIndex = null;
    this.editDeployment = null;
  }

  get filteredDeployments(): Deployment[] {
    return this.deployments.filter(d => d.assessmentId === this.assessmentId);
  }

  addDeployment() {
    const nextNumber = this.deployments.length > 0 ? Math.max(...this.deployments.map(d => d.number)) + 1 : 1;
    const newDeployment: Deployment = {
      number: nextNumber,
      title: '',
      type: this.deploymentTypes[0],
      status: this.deploymentStatuses[0],
      startDate: '',
      endDate: '',
      description: '',
      assessmentId: this.assessmentId
    };
    this.deployments.push(newDeployment);
    // Immediately enter edit mode for the new deployment
    this.editIndex = this.filteredDeployments.length - 1;
    this.editDeployment = { ...newDeployment };
  }
}
