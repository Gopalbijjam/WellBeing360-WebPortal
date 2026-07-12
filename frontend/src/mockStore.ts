import type {
  User, BenefitPlan, FlexBenefitBucket, EnrolmentWindow, BenefitEnrolment, Dependent,
  WellnessProgram, WellnessChallenge, ActivityLog, EAPService, EAPSession,
  RecognitionAward, RewardPoints, RedemptionCatalog, Notification, BenefitsReport, AuditLog
} from './types';

// Seed default mock state
const DEFAULT_USERS: User[] = [
  { userID: 1, employeeID: "EMP-482019", name: "John Employee", role: "Employee", email: "employee@wellbeing360.com", phone: "+155501001", gradeID: "G3", departmentID: "Engineering", status: "Active" },
  { userID: 2, employeeID: "EMP-928103", name: "Sarah HR Benefits", role: "HRBenefitsAdmin", email: "hrbenefits@wellbeing360.com", phone: "+155501002", gradeID: "G5", departmentID: "Human Resources", status: "Active" },
  { userID: 3, employeeID: "EMP-104928", name: "Robert Finance", role: "Finance", email: "finance@wellbeing360.com", phone: "+155501003", gradeID: "G6", departmentID: "Finance", status: "Active" },
  { userID: 4, employeeID: "EMP-736281", name: "Emma Wellness", role: "WellnessCoordinator", email: "wellness@wellbeing360.com", phone: "+155501004", gradeID: "G4", departmentID: "Human Resources", status: "Active" },
  { userID: 5, employeeID: "EMP-283746", name: "David Recognition", role: "RecognitionManager", email: "recognition@wellbeing360.com", phone: "+155501005", gradeID: "G4", departmentID: "People & Culture", status: "Active" },
  { userID: 6, employeeID: "EMP-573829", name: "Alice Administrator", role: "Admin", email: "admin@wellbeing360.com", phone: "+155501006", gradeID: "G7", departmentID: "IT", status: "Active" }
];

const DEFAULT_PLANS: BenefitPlan[] = [
  { planID: 1, planName: "Gold Premium Health Insurance", planType: "GroupHealthInsurance", eligibilityGrade: "G1,G2,G3,G4,G5,G6,G7", employeeContribution: 50.00, employerContribution: 200.00, coverageLimit: 500000.00, effectiveDate: "2026-01-01", status: "Active" },
  { planID: 2, planName: "Silver Saver Health Insurance", planType: "GroupHealthInsurance", eligibilityGrade: "G1,G2,G3,G4,G5", employeeContribution: 20.00, employerContribution: 150.00, coverageLimit: 300000.00, effectiveDate: "2026-01-01", status: "Active" },
  { planID: 3, planName: "Elite Dental & Vision Care", planType: "DentalVision", eligibilityGrade: "G2,G3,G4,G5,G6,G7", employeeContribution: 15.00, employerContribution: 45.00, coverageLimit: 50000.00, effectiveDate: "2026-01-01", status: "Active" },
  { planID: 4, planName: "Universal Flexible Benefits Program", planType: "FlexibleBenefit", eligibilityGrade: "G3,G4,G5,G6,G7", employeeContribution: 0.00, employerContribution: 0.00, coverageLimit: 120000.00, effectiveDate: "2026-01-01", status: "Active" }
];

const DEFAULT_BUCKETS: FlexBenefitBucket[] = [
  { bucketID: 1, planID: 4, bucketName: "Medical", annualAllowance: 25000.00, carryForwardAllowed: true, status: "Active" },
  { bucketID: 2, planID: 4, bucketName: "Childcare", annualAllowance: 40000.00, carryForwardAllowed: false, status: "Active" },
  { bucketID: 3, planID: 4, bucketName: "Fitness", annualAllowance: 15000.00, carryForwardAllowed: true, status: "Active" },
  { bucketID: 4, planID: 4, bucketName: "Education", annualAllowance: 25000.00, carryForwardAllowed: true, status: "Active" },
  { bucketID: 5, planID: 4, bucketName: "Meal", annualAllowance: 15000.00, carryForwardAllowed: false, status: "Active" }
];

const DEFAULT_WINDOWS: EnrolmentWindow[] = [
  { windowID: 1, planYear: 2026, openDate: "2026-01-01", closeDate: "2026-12-31", eligibleGrades: "G1,G2,G3,G4,G5,G6,G7", status: "Open" }
];

const DEFAULT_PROGRAMS: WellnessProgram[] = [
  { programID: 1, name: "Global Employee Wellness Sprint 2026", theme: "Fitness", startDate: "2026-06-01", endDate: "2026-08-31", pointsOnOffer: 1000, targetParticipation: 250, status: "Active" },
  { programID: 2, name: "Mind & Soul Mindfulness Camp", theme: "MentalHealth", startDate: "2026-09-01", endDate: "2026-10-31", pointsOnOffer: 500, targetParticipation: 150, status: "Upcoming" }
];

const DEFAULT_CHALLENGES: WellnessChallenge[] = [
  { challengeID: 1, programID: 1, challengeName: "10K Daily Steps Challenge", activityType: "Steps", dailyTarget: 10000, duration: 30, pointsPerCompletion: 100, status: "Active" },
  { challengeID: 2, programID: 1, challengeName: "Daily Meditation Mindfulness", activityType: "Meditation", dailyTarget: 15, duration: 20, pointsPerCompletion: 150, status: "Active" },
  { challengeID: 3, programID: 1, challengeName: "Hydration Tracker Challenge", activityType: "WaterIntake", dailyTarget: 8, duration: 15, pointsPerCompletion: 50, status: "Active" }
];

const DEFAULT_EAP_SERVICES: EAPService[] = [
  { serviceID: 1, serviceName: "Confidential Mental Health Counselling", category: "MentalHealthCounselling", sessionsAllowedPerEmployee: 5, status: "Active" },
  { serviceID: 2, serviceName: "Corporate Legal Consultation Assistance", category: "LegalAdvisory", sessionsAllowedPerEmployee: 3, status: "Active" },
  { serviceID: 3, serviceName: "Smart Personal Wealth & Budget Counseling", category: "FinancialCounselling", sessionsAllowedPerEmployee: 4, status: "Active" },
  { serviceID: 4, serviceName: "Work-Life Parenting Advisory Support", category: "ParentingAdvisory", sessionsAllowedPerEmployee: 6, status: "Active" }
];

const DEFAULT_CATALOG: RedemptionCatalog[] = [
  { itemID: 1, itemName: "$10 Amazon Gift Voucher", category: "Voucher", pointsRequired: 100, availableQuantity: 100, status: "Available" },
  { itemID: 2, itemName: "$50 Starbucks Gift Card", category: "Voucher", pointsRequired: 450, availableQuantity: 50, status: "Available" },
  { itemID: 3, itemName: "Premium Fitness Tracker Watch", category: "Merchandise", pointsRequired: 1000, availableQuantity: 10, status: "Available" },
  { itemID: 4, itemName: "Gym Membership 1-Month Pass", category: "Experience", pointsRequired: 600, availableQuantity: 20, status: "Available" },
  { itemID: 5, itemName: "Donate $25 to Red Cross", category: "Charity", pointsRequired: 250, availableQuantity: 999, status: "Available" }
];

class MockStore {
  private get<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(`mock_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  }

  private set<T>(key: string, value: T): void {
    localStorage.setItem(`mock_${key}`, JSON.stringify(value));
  }

  get users() { return this.get<User[]>('users', DEFAULT_USERS); }
  set users(val) { this.set('users', val); }

  get plans() { return this.get<BenefitPlan[]>('plans', DEFAULT_PLANS); }
  set plans(val) { this.set('plans', val); }

  get buckets() { return this.get<FlexBenefitBucket[]>('buckets', DEFAULT_BUCKETS); }
  set buckets(val) { this.set('buckets', val); }

  get windows() { return this.get<EnrolmentWindow[]>('windows', DEFAULT_WINDOWS); }
  set windows(val) { this.set('windows', val); }

  get enrolments() { return this.get<BenefitEnrolment[]>('enrolments', []); }
  set enrolments(val) { this.set('enrolments', val); }

  get dependents() { return this.get<Dependent[]>('dependents', []); }
  set dependents(val) { this.set('dependents', val); }

  get programs() { return this.get<WellnessProgram[]>('programs', DEFAULT_PROGRAMS); }
  set programs(val) { this.set('programs', val); }

  get challenges() { return this.get<WellnessChallenge[]>('challenges', DEFAULT_CHALLENGES); }
  set challenges(val) { this.set('challenges', val); }

  get activityLogs() { return this.get<ActivityLog[]>('activityLogs', []); }
  set activityLogs(val) { this.set('activityLogs', val); }

  get eapServices() { return this.get<EAPService[]>('eapServices', DEFAULT_EAP_SERVICES); }
  set eapServices(val) { this.set('eapServices', val); }

  get eapSessions() { return this.get<EAPSession[]>('eapSessions', []); }
  set eapSessions(val) { this.set('eapSessions', val); }

  get awards() { return this.get<RecognitionAward[]>('awards', []); }
  set awards(val) { this.set('awards', val); }

  get points() {
    const defaultPoints: RewardPoints[] = DEFAULT_USERS.map((u, i) => ({
      pointsID: i + 1,
      employeeID: u.employeeID,
      totalEarned: 300,
      totalRedeemed: 0,
      balance: 300,
      lastUpdated: new Date().toISOString()
    }));
    return this.get<RewardPoints[]>('points', defaultPoints);
  }
  set points(val) { this.set('points', val); }

  get catalog() { return this.get<RedemptionCatalog[]>('catalog', DEFAULT_CATALOG); }
  set catalog(val) { this.set('catalog', val); }

  get notifications() { return this.get<Notification[]>('notifications', []); }
  set notifications(val) { this.set('notifications', val); }

  get reports() { return this.get<BenefitsReport[]>('reports', []); }
  set reports(val) { this.set('reports', val); }

  get auditLogs() { return this.get<AuditLog[]>('auditLogs', []); }
  set auditLogs(val) { this.set('auditLogs', val); }

  logAudit(userId: string, action: string, module: string) {
    const newLog: AuditLog = {
      auditID: this.auditLogs.length + 1,
      userID: userId,
      action,
      module,
      timestamp: new Date().toISOString()
    };
    this.auditLogs = [newLog, ...this.auditLogs];
  }

  addNotification(employeeId: string, message: string, category: string) {
    const newNotif: Notification = {
      notificationID: this.notifications.length + 1,
      userID: employeeId,
      message,
      category,
      status: 'Unread',
      createdDate: new Date().toISOString()
    };
    this.notifications = [newNotif, ...this.notifications];
  }

  addPoints(employeeId: string, points: number, reason: string) {
    const list = this.points;
    let record = list.find(p => p.employeeID === employeeId);
    if (!record) {
      record = {
        pointsID: list.length + 1,
        employeeID: employeeId,
        totalEarned: points,
        totalRedeemed: 0,
        balance: points,
        lastUpdated: new Date().toISOString()
      };
      list.push(record);
    } else {
      record.totalEarned += points;
      record.balance += points;
      record.lastUpdated = new Date().toISOString();
    }
    this.points = [...list];
    this.addNotification(employeeId, `Points credited: ${reason} (+${points} pts).`, 'Wellness');
  }
}

export const mockStore = new MockStore();
