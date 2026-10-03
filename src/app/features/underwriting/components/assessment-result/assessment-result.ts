
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { UnderwritingService } from '../../services/underwriting.service';
import { RiskAssessment } from '../../models/underwriting.model';

@Component({
  selector: 'app-assessment-result',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './assessment-result.html',
  styleUrl: './assessment-result.scss'
})
export class AssessmentResult {
  private readonly underwritingService =
    inject(UnderwritingService);

  private readonly router = inject(Router);

  assessment: RiskAssessment | null =
    this.underwritingService.getCurrentAssessment();

  goBack(): void {
    this.router.navigate(['/underwriting']);
  }
}