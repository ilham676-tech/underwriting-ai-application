
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UnderwritingDashboard } from './underwriting-dashboard';
import { RiskAssessment } from '../../models/underwriting.model';

describe('UnderwritingDashboardComponent', () => {
  let component: UnderwritingDashboard;
  let fixture: ComponentFixture<UnderwritingDashboard>;

  const mockAssessments: RiskAssessment[] = [
    {
      applicationId: 'UW-1001',
      applicantName: 'John Smith',
      propertyType: 'RESIDENTIAL',
      riskScore: 75,
      riskLevel: 'HIGH',
      riskFactors: ['Old roof'],
      protectiveFactors: [],
      recommendedAction: 'Manual review',
      assessedAt: new Date().toISOString()
    },
    {
      applicationId: 'UW-1002',
      applicantName: 'Sarah Lee',
      propertyType: 'COMMERCIAL',
      riskScore: 45,
      riskLevel: 'MEDIUM',
      riskFactors: ['Previous claims'],
      protectiveFactors: [],
      recommendedAction: 'Request information',
      assessedAt: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderwritingDashboard],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(
      UnderwritingDashboard
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard', () => {
    expect(component).toBeTruthy();
  });

  it('should filter applications by applicant name', () => {
    component.searchControl.setValue('john');

    const results = component.filteredAssessments(mockAssessments);

    expect(results.length).toBe(1);
    expect(results[0].applicantName).toBe('John Smith');
  });

  it('should filter applications by ID', () => {
    component.searchControl.setValue('UW-1002');

    const results = component.filteredAssessments(mockAssessments);

    expect(results.length).toBe(1);
    expect(results[0].applicationId).toBe('UW-1002');
  });

  it('should filter applications by risk level', () => {
    component.riskControl.setValue('HIGH');

    const results = component.filteredAssessments(mockAssessments);

    expect(results.length).toBe(1);
    expect(results[0].riskLevel).toBe('HIGH');
  });

  it('should return all matching applications when filters are clear', () => {
    const results = component.filteredAssessments(mockAssessments);

    expect(results.length).toBe(2);
  });
});