export interface User {
  userID: number;
  employeeID: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  gradeID: string;
  departmentID: string;
  status: string;
}

export interface BenefitPlan {
  planID: number;
  planName: string;
  planType: string; // GroupHealthInsurance, LifeCover, DentalVision, FlexibleBenefit, RetirementContribution, Commuter
  eligibilityGrade: string; // comma-separated
  employeeContribution: number;
  employerContribution: number;
  coverageLimit: number;
  effectiveDate: string;
  status: string;
}

export interface FlexBenefitBucket {
  bucketID: number;
  planID: number;
  bucketName: string; // Medical, Childcare, Fitness, Education, Transport, Meal
  annualAllowance: number;
  carryForwardAllowed: boolean;
  status: string;
}

export interface EnrolmentWindow {
  windowID: number;
  planYear: number;
  openDate: string;
  closeDate: string;
  eligibleGrades: string;
  status: string; // Upcoming, Open, Closed
}

export interface BenefitEnrolment {
  enrolmentID: number;
  employeeID: string;
  planID: number;
  windowID: number;
  coverageOption: string;
  dependentsIncluded: boolean;
  employeeContributionAmount: number;
  effectiveDate: string;
  status: string; // Draft, Submitted, Active, Lapsed, Cancelled
}

export interface Dependent {
  dependentID: number;
  employeeID: string;
  name: string;
  relationship: string; // Spouse, Child, Parent
  dateOfBirth: string;
  status: string;
}

export interface WellnessProgram {
  programID: number;
  name: string;
  theme: string; // Fitness, Nutrition, MentalHealth, Preventive, WorkLifeBalance
  startDate: string;
  endDate: string;
  pointsOnOffer: number;
  targetParticipation: number;
  status: string;
}

export interface WellnessChallenge {
  challengeID: number;
  programID: number;
  challengeName: string;
  activityType: string; // Steps, Meditation, WaterIntake, SleepLog, NutritionTrack
  dailyTarget: number;
  duration: number;
  pointsPerCompletion: number;
  status: string;
}

export interface ActivityLog {
  logID: number;
  challengeID: number;
  employeeID: string;
  logDate: string;
  activityValue: number;
  pointsEarned: number;
  status: string; // Submitted, Verified
}

export interface EAPService {
  serviceID: number;
  serviceName: string;
  category: string;
  sessionsAllowedPerEmployee: number;
  status: string;
}

export interface EAPSession {
  sessionID: number;
  employeeID: string;
  serviceID: number;
  requestedDate: string;
  sessionDate: string;
  counsellorRef: string;
  status: string; // Requested, Scheduled, Completed, Cancelled
}

export interface RecognitionAward {
  awardID: number;
  nominatorID: string;
  recipientID: string;
  category: string;
  badgeName: string;
  pointsAwarded: number;
  message: string;
  awardDate: string;
  status: string;
}

export interface RewardPoints {
  pointsID: number;
  employeeID: string;
  totalEarned: number;
  totalRedeemed: number;
  balance: number;
  lastUpdated: string;
}

export interface RedemptionCatalog {
  itemID: number;
  itemName: string;
  category: string; // Voucher, Merchandise, Experience, Charity
  pointsRequired: number;
  availableQuantity: number;
  status: string;
}

export interface Notification {
  notificationID: number;
  userID: string;
  message: string;
  category: string; // Enrolment, Wellness, EAP, Recognition, Benefits
  status: string; // Unread, Read, Dismissed
  createdDate: string;
}

export interface BenefitsReport {
  reportID: number;
  scope: string;
  metrics: {
    EnrolmentRate: number;
    PremiumCost: number;
    ClaimsSubmitted: number;
    WellnessParticipation: number;
    EAPUtilisation: number;
    RecognitionCount: number;
    PointsRedeemed: number;
  };
  generatedDate: string;
}

export interface AuditLog {
  auditID: number;
  userID: string;
  action: string;
  module: string;
  timestamp: string;
}
