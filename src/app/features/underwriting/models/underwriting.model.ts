export interface PropertyDetails {
  propertyType: string;
  yearBuilt: number;
  propertyValue: number;
  roofAge: number;
  fireProtection: boolean;
  securitySystem: boolean;
  swimmingPool: boolean;
  trampoline: boolean;
  previousClaims: number;
  location: string;
}

export interface UnderwritingApplication {
  applicant: {
    fullName: string;
    email: string;
  };
  property: PropertyDetails;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskAssessment { 
  applicationId: string; 
  applicantName: string; 
  applicantEmail: string; 
  propertyType: string; 
  riskScore: number; 
  riskLevel: RiskLevel; 
  riskFactors: string[]; 
  protectiveFactors: string[]; 
  recommendation: string; 
  assessedAt: string; 
}

// Alias used by the API/service layer 
export type AssessmentResponse = RiskAssessment;