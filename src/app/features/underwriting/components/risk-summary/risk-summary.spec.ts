import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskSummary } from './risk-summary';

describe('RiskSummary', () => {
  let component: RiskSummary;
  let fixture: ComponentFixture<RiskSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
