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
  applicantName: string;
  applicantEmail: string;
  property: PropertyDetails;
}