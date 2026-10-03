
import { TestBed } from '@angular/core/testing';
import { UnderwritingService } from './underwriting.service';
import { UnderwritingApplication } from '../models/underwriting.model';

describe('UnderwritingService', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  let service: UnderwritingService;

  const createApplication = (
    overrides: Partial<UnderwritingApplication['property']> = {}
  ): UnderwritingApplication => ({
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
      trampoline: false,
      ...overrides
    }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnderwritingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate a low risk score for a property without configured risk factors', () => {
    let result: any;

    service.assessProperty(createApplication())
      .subscribe(value => result = value);

    vi.advanceTimersByTime(700);

    expect(result.riskScore).toBe(10);
    expect(result.riskLevel).toBe('LOW');
    expect(result.riskFactors).toEqual([]);
  });

  it('should identify an old property as a risk factor', () => {
    let result: any;

    service.assessProperty(
      createApplication({ yearBuilt: 1990 })
    ).subscribe(value => result = value);

    vi.advanceTimersByTime(700);

    expect(result.riskScore).toBe(25);
    expect(result.riskLevel).toBe('LOW');
    expect(result.riskFactors).toContain(
      'Property was built before 2000'
    );
  });

  it('should calculate a high risk score for multiple risk factors', () => {
    let result: any;

    service.assessProperty(
      createApplication({
        yearBuilt: 1990,
        roofAge: 20,
        previousClaims: 2,
        swimmingPool: true,
        trampoline: true
      })
    ).subscribe(value => result = value);

    vi.advanceTimersByTime(700);

    expect(result.riskScore).toBe(90);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.riskFactors.length).toBe(5);
  });

  it('should account for protective factors', () => {
    let result: any;

    service.assessProperty(
      createApplication({
        fireProtection: true,
        securitySystem: true
      })
    ).subscribe(value => result = value);

    vi.advanceTimersByTime(700);

    expect(result.riskScore).toBe(0);
    expect(result.riskLevel).toBe('LOW');
    expect(result.protectiveFactors.length).toBe(2);
  });

  it('should add a completed assessment to application history', () => {
    service.assessProperty(createApplication())
      .subscribe();

    vi.advanceTimersByTime(700);

    expect(service.getAssessments().length).toBe(1);
  });

  it('should keep the most recent assessment at the top', () => {
    service.assessProperty(createApplication())
      .subscribe();

    vi.advanceTimersByTime(700);

    service.assessProperty(
      createApplication({ yearBuilt: 1990 })
    ).subscribe();

    vi.advanceTimersByTime(700);

    const assessments = service.getAssessments();

    expect(assessments.length).toBe(2);
    expect(assessments[0].riskScore).toBe(25);
  });

  it('should return the current assessment', () => {
    service.assessProperty(createApplication())
      .subscribe();

    vi.advanceTimersByTime(700);

    expect(service.getCurrentAssessment())
      .toEqual(service.getAssessments()[0]);
  });

  it('should open an existing assessment by ID', () => {
    service.assessProperty(createApplication())
      .subscribe();

    vi.advanceTimersByTime(700);

    const first = service.getAssessments()[0];

    service.assessProperty(
      createApplication({ yearBuilt: 1990 })
    ).subscribe();

    vi.advanceTimersByTime(700);

    service.openAssessment(first.applicationId);

    expect(service.getCurrentAssessment()?.applicationId)
      .toBe(first.applicationId);
  });
});