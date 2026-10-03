
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { UnderwritingFormComponent } from './underwriting-form';
import { UnderwritingService } from '../../services/underwriting.service';
import { RiskAssessment } from '../../models/underwriting.model';

describe('UnderwritingFormComponent', () => {
  let fixture: ComponentFixture<UnderwritingFormComponent>;
  let component: UnderwritingFormComponent;
  let serviceSpy: Pick<UnderwritingService, 'assessProperty'>;
  let router: Router;

  const mockAssessment: RiskAssessment = {
    applicationId: 'UW-TEST-1',
    applicantName: 'John Smith',
    propertyType: 'RESIDENTIAL',
    riskScore: 25,
    riskLevel: 'LOW',
    riskFactors: [],
    protectiveFactors: [],
    recommendedAction: 'Continue to standard review',
    assessedAt: new Date().toISOString()
  };

  beforeEach(async () => {
    serviceSpy = {
      assessProperty: vi.fn().mockReturnValue(of(mockAssessment))
    };

    await TestBed.configureTestingModule({
      imports: [UnderwritingFormComponent],
      providers: [
        provideRouter([]),
        { provide: UnderwritingService, useValue: serviceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UnderwritingFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form as invalid', () => {
    expect(component.underwritingForm.invalid).toBe(true);
  });

  it('should mark fields as touched on invalid submission', () => {
    component.submit();

    expect(
      component.underwritingForm.get('applicant.fullName')?.touched
    ).toBe(true);

    expect(serviceSpy.assessProperty).not.toHaveBeenCalled();
  });

  it('should submit a valid application', () => {
    component.underwritingForm.setValue({
      applicant: {
        fullName: 'John Smith',
        email: 'john@example.com'
      },
      property: {
        propertyType: 'RESIDENTIAL',
        location: 'Miami, Florida',
        yearBuilt: 2010,
        propertyValue: 300000,
        roofAge: 5,
        previousClaims: 0,
        fireProtection: false,
        securitySystem: false,
        swimmingPool: false,
        trampoline: false
      }
    });

    vi.spyOn(router, 'navigate').mockReturnValue(
      Promise.resolve(true)
    );

    component.submit();

    expect(serviceSpy.assessProperty).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([
      '/assessment-result'
    ]);
    expect(component.isLoading).toBe(false);
  });
});