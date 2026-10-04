
import { Component, DestroyRef, inject } from '@angular/core';
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
import { AssessmentResponse } from '../../../../models/assessment.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  private underwritingService = inject(UnderwritingService);

  assessments: AssessmentResponse[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  private destroyRef = inject(DestroyRef);

  readonly assessments$ = this.service.assessments$;

  readonly searchControl = new FormControl('', {
    nonNullable: true
  });

  readonly riskControl = new FormControl('ALL', {
    nonNullable: true
  });

  ngOnInit(): void {
    // Listen for new assessments and history updates 
    this.underwritingService.assessments$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(data => { 
      this.assessments = data; 
    }); 
    // Load the latest history from the backend
    this.loadAssessments();
  }

  loadAssessments(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.underwritingService.getAssessments()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({ next: () => { 
      this.isLoading = false; 
    }, 
    error: (error) => { 
      this.isLoading = false; 
      this.errorMessage = 'Unable to load assessment history.'; 
      console.error('History API error:', error); } 
    }); 
  }

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
    assessments: AssessmentResponse[]
  ): AssessmentResponse[] {
    const search = this.searchControl.value
      .trim()
      .toLowerCase() ?? '';

    const risk = this.riskControl.value ?? 'ALL';

    return assessments.filter(item => {
      const matchesSearch =
        !search ||
        item.applicantName.toLowerCase().includes(search) ||
        item.applicationId.toLowerCase().includes(search);

      const matchesRisk =
        risk === 'ALL' || item.riskLevel === risk;

      return matchesSearch && matchesRisk;
    });
  }

  countByRisk(
    assessments: AssessmentResponse[],
    level: RiskLevel
  ): number {
    return assessments.filter(
      item => item.riskLevel === level
    ).length;
  }

  viewAssessment(applicationId: string): void {
    console.log('applicationId',applicationId);
    this.router.navigate([
      '/assessment-result',
      applicationId
    ]);
  }

  createApplication(): void {
    this.router.navigate(['/underwriting']);
  }
}