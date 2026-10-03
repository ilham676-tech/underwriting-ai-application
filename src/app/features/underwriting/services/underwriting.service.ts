
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import {
  UnderwritingApplication,
  RiskAssessment
} from '../models/underwriting.model';

@Injectable({
  providedIn: 'root'
})
export class UnderwritingService {

  private readonly assessmentsSubject =
    new BehaviorSubject<RiskAssessment[]>([]);

  readonly assessments$ =
    this.assessmentsSubject.asObservable();

  private readonly currentAssessmentSubject =
    new BehaviorSubject<RiskAssessment | null>(null);

  readonly assessment$ =
    this.currentAssessmentSubject.asObservable();

  assessProperty(
    application: UnderwritingApplication
  ): Observable<RiskAssessment> {

    const property = application.property;
    let score = 10;

    const riskFactors: string[] = [];
    const protectiveFactors: string[] = [];

    if (property.yearBuilt < 2000) {
      score += 15;
      riskFactors.push('Property was built before 2000');
    }

    if (property.roofAge > 15) {
      score += 20;
      riskFactors.push('Roof is more than 15 years old');
    }

    if (property.previousClaims > 0) {
      score += Math.min(property.previousClaims * 10, 30);
      riskFactors.push(
        `${property.previousClaims} previous claims reported`
      );
    }

    if (property.swimmingPool) {
      score += 10;
      riskFactors.push('Swimming pool present');
    }

    if (property.trampoline) {
      score += 15;
      riskFactors.push('Trampoline present');
    }

    if (property.fireProtection) {
      score -= 10;
      protectiveFactors.push('Fire protection system present');
    }

    if (property.securitySystem) {
      score -= 5;
      protectiveFactors.push('Security system present');
    }

    score = Math.max(0, Math.min(score, 100));

    const riskLevel =
      score <= 30 ? 'LOW' :
      score <= 60 ? 'MEDIUM' : 'HIGH';

    const recommendedAction =
      riskLevel === 'LOW'
        ? 'Continue to standard review'
        : riskLevel === 'MEDIUM'
          ? 'Request additional property information'
          : 'Refer for manual underwriting review';

    const assessment: RiskAssessment = {
      applicationId: `UW-${Date.now()}`,
      applicantName: application.applicant.fullName,
      propertyType: property.propertyType,
      riskScore: score,
      riskLevel,
      riskFactors,
      protectiveFactors,
      recommendedAction,
      assessedAt: new Date().toISOString()
    };

    return of(assessment).pipe(
      delay(700),
      tap(result => {
        this.assessmentsSubject.next([
          result,
          ...this.assessmentsSubject.value
        ]);

        this.currentAssessmentSubject.next(result);
      })
    );
  }

  getCurrentAssessment(): RiskAssessment | null {
    return this.currentAssessmentSubject.value;
  }

  openAssessment(applicationId: string): void {
    const assessment = this.assessmentsSubject.value.find(
      item => item.applicationId === applicationId
    );

    if (assessment) {
      this.currentAssessmentSubject.next(assessment);
    }
  }

  getAssessments(): RiskAssessment[] {
    return this.assessmentsSubject.value;
  }
}