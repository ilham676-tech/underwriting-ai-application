
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { UnderwritingService } from '../../services/underwriting.service';
import {
  RiskAssessment,
  RiskLevel
} from '../../models/underwriting.model';

@Component({
  selector: 'app-underwriting-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './underwriting-dashboard.html',
  styleUrl: './underwriting-dashboard.scss'
})
export class UnderwritingDashboard {
  private readonly service = inject(UnderwritingService);
  private readonly router = inject(Router);

  readonly assessments$ = this.service.assessments$;

  readonly searchControl = new FormControl('', {
    nonNullable: true
  });

  readonly riskControl = new FormControl('ALL', {
    nonNullable: true
  });

  readonly displayedColumns = [
    'applicationId',
    'applicantName',
    'propertyType',
    'riskScore',
    'riskLevel',
    'assessedAt',
    'actions'
  ];

  filteredAssessments(
    assessments: RiskAssessment[]
  ): RiskAssessment[] {
    const search = this.searchControl.value
      .trim()
      .toLowerCase();

    const risk = this.riskControl.value;

    return assessments.filter(item => {
      const matchesSearch =
        item.applicantName.toLowerCase().includes(search) ||
        item.applicationId.toLowerCase().includes(search);

      const matchesRisk =
        risk === 'ALL' || item.riskLevel === risk;

      return matchesSearch && matchesRisk;
    });
  }

  countByRisk(
    assessments: RiskAssessment[],
    level: RiskLevel
  ): number {
    return assessments.filter(
      item => item.riskLevel === level
    ).length;
  }

  viewAssessment(applicationId: string): void {
    this.service.openAssessment(applicationId);
    this.router.navigate(['/assessment-result']);
  }

  createApplication(): void {
    this.router.navigate(['/underwriting']);
  }
}