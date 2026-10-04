
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import {
  UnderwritingApplication,
  RiskAssessment
} from '../models/underwriting.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AssessmentRequest, AssessmentResponse } from '../../../models/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class UnderwritingService {

  private http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/underwriting/assessments`;

  private readonly assessmentsSubject =
    new BehaviorSubject<AssessmentResponse[]>([]);

  readonly assessments$ =
    this.assessmentsSubject.asObservable();

  private readonly currentAssessmentSubject =
    new BehaviorSubject<RiskAssessment | null>(null);

  readonly assessment$ =
    this.currentAssessmentSubject.asObservable();

  assessProperty(
    request: AssessmentRequest
  ): Observable<AssessmentResponse> {

    return this.http.post<AssessmentResponse>(
      this.apiUrl,
      request
    ).pipe(
      tap((assessment) => {

        const current = this.assessmentsSubject.value;

        this.assessmentsSubject.next([
          assessment,
          ...current.filter(
            item => item.applicationId !== assessment.applicationId
          )
        ]);
      })
    );
  }

    
  getAssessments(): Observable<AssessmentResponse[]> {
    return this.http.get<AssessmentResponse[]>( 
      this.apiUrl 
    ).pipe( 
      tap((assessments) => { 
        this.assessmentsSubject.next(assessments); 
      }) 
    );
  }

  getCurrentAssessment(): RiskAssessment | null {
    return this.currentAssessmentSubject.value;
  }

  getAssessmentById(
    id: string
  ): Observable<AssessmentResponse> {
    return this.http.get<AssessmentResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  openAssessment(applicationId: string): void {
    const assessment = this.assessmentsSubject.value.find(
      item => item.applicationId === applicationId
    );

    if (assessment) {
      this.currentAssessmentSubject.next(assessment);
    }
  }
}