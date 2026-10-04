export interface PropertyDetails {
  propertyType: string;
  location: string;
  yearBuilt: number;
  propertyValue: number;
  roofAge: number;
  previousClaims: number;
  fireProtection: boolean;
  securitySystem: boolean;
  swimmingPool: boolean;
  trampoline: boolean;
}

export interface AssessmentRequest {
  applicantName: string;
  applicantEmail: string;
  propertyDetails: PropertyDetails;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AssessmentResponse {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  propertyType: string;

  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';

  riskFactors: string[];
  protectiveFactors: string[];

  recommendation: string;
  assessedAt: string;
}
