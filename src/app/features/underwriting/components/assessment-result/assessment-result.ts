import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { UnderwritingService } from '../../services/underwriting.service';
import { AssessmentResponse } from '../../../../models/assessment.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-assessment-result',
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule ],
  templateUrl: './assessment-result.html',
  styleUrl: './assessment-result.scss'
})
export class AssessmentResult implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private underwritingService = inject(UnderwritingService);

  assessment: AssessmentResponse | null = null;

  isLoading = false;
  errorMessage: string | null = null;
  subscriptions : Subscription[] = [];

  ngOnInit(): void {
    const applicationId =
      this.route.snapshot.paramMap.get('applicationId');

    if (!applicationId) {
      this.isLoading = false;
      this.errorMessage = 'Assessment ID is missing.';
      return;
    }
  }

  ngAfterView

  private loadAssessment(applicationId: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.assessment = null;

    this.subscriptions.push(
    this.underwritingService
      .getAssessmentById(applicationId)
      .subscribe({
        next: (assessment) => {
          this.assessment = assessment;
          this.isLoading = false;
        },

        error: (error) => {
          console.error(
            'Failed to load assessment:',
            error
          );

          this.isLoading = false;

          if (error.status === 404) {
            this.errorMessage =
              'Assessment not found.';
          } else {
            this.errorMessage =
              'Unable to load the assessment. Please try again.';
          }
        }
      }),
    );
  }

  backToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
