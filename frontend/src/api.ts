import type {
  User, BenefitPlan, EnrolmentWindow, BenefitEnrolment, Dependent,
  WellnessProgram, WellnessChallenge, ActivityLog, EAPService, EAPSession,
  RecognitionAward, RewardPoints, RedemptionCatalog, Notification, BenefitsReport, AuditLog
} from './types';

const GATEWAY_URL = 'http://localhost:5000/api';

// Strictly live mode client settings
export const getDemoModeStatus = () => false;
export const setDemoModeStatus = (_status: boolean) => {};

function getHeaders() {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = { ...getHeaders(), ...options.headers };
  const response = await fetch(`${GATEWAY_URL}${url}`, {
    ...options,
    headers
  });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
    throw new Error('Unauthorized or session expired.');
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || 'API Error');
  }

  if (response.status === 204) {
    return {} as T;
  }
  
  return await response.json();
}

// Authentication & Users API
export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    return await apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  register: async (data: any): Promise<{ message: string; employeeID: string }> => {
    return await apiRequest<{ message: string; employeeID: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  fetchUsers: async (): Promise<User[]> => {
    return await apiRequest<User[]>('/auth/users');
  },
  
  fetchAuditLogs: async (): Promise<AuditLog[]> => {
    return await apiRequest<AuditLog[]>('/auth/audit-logs');
  },

  updateUserStatus: async (userId: number, status: 'Active' | 'Inactive'): Promise<{ message: string }> => {
    return await apiRequest<{ message: string }>(`/auth/users/${userId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
  }
};

// Benefits Configuration API
export const benefitsApi = {
  fetchPlans: async (): Promise<BenefitPlan[]> => {
    return await apiRequest<BenefitPlan[]>('/benefits/plans');
  },
  
  createPlan: async (plan: Partial<BenefitPlan>): Promise<BenefitPlan> => {
    return await apiRequest<BenefitPlan>('/benefits/plans', {
      method: 'POST',
      body: JSON.stringify(plan)
    });
  },
  
  fetchWindows: async (): Promise<EnrolmentWindow[]> => {
    return await apiRequest<EnrolmentWindow[]>('/benefits/windows');
  },
  
  createWindow: async (window: Partial<EnrolmentWindow>): Promise<EnrolmentWindow> => {
    return await apiRequest<EnrolmentWindow>('/benefits/windows', {
      method: 'POST',
      body: JSON.stringify(window)
    });
  },
  
  fetchEnrolments: async (): Promise<BenefitEnrolment[]> => {
    return await apiRequest<BenefitEnrolment[]>('/benefits/enrolments');
  },
  
  fetchMyEnrolments: async (): Promise<BenefitEnrolment[]> => {
    return await apiRequest<BenefitEnrolment[]>('/benefits/my-enrolments');
  },
  
  enrol: async (payload: any): Promise<BenefitEnrolment> => {
    return await apiRequest<BenefitEnrolment>('/benefits/enrol', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  
  verifyEnrolment: async (id: number, status: string): Promise<void> => {
    await apiRequest<void>(`/benefits/enrolments/${id}/verify?status=${status}`, {
      method: 'POST'
    });
  },
  
  fetchMyDependents: async (): Promise<Dependent[]> => {
    return await apiRequest<Dependent[]>('/benefits/my-dependents');
  },

  approvePlan: async (id: number): Promise<void> => {
    await apiRequest<void>(`/benefits/plans/${id}/approve`, {
      method: 'POST'
    });
  },
  
  rejectPlan: async (id: number): Promise<void> => {
    await apiRequest<void>(`/benefits/plans/${id}/reject`, {
      method: 'POST'
    });
  }
};

// Wellness & EAP Scheduling API
export const wellnessApi = {
  fetchPrograms: async (): Promise<WellnessProgram[]> => {
    return await apiRequest<WellnessProgram[]>('/wellness/programs');
  },
  
  createProgram: async (prog: Partial<WellnessProgram>): Promise<WellnessProgram> => {
    return await apiRequest<WellnessProgram>('/wellness/programs', {
      method: 'POST',
      body: JSON.stringify(prog)
    });
  },
  
  fetchChallenges: async (): Promise<WellnessChallenge[]> => {
    return await apiRequest<WellnessChallenge[]>('/wellness/challenges');
  },
  
  createChallenge: async (chal: Partial<WellnessChallenge>): Promise<WellnessChallenge> => {
    return await apiRequest<WellnessChallenge>('/wellness/challenges', {
      method: 'POST',
      body: JSON.stringify(chal)
    });
  },
  
  fetchMyLogs: async (): Promise<ActivityLog[]> => {
    return await apiRequest<ActivityLog[]>('/wellness/logs/my');
  },
  
  fetchPendingLogs: async (): Promise<ActivityLog[]> => {
    return await apiRequest<ActivityLog[]>('/wellness/logs/pending');
  },
  
  submitActivityLog: async (log: { challengeID: number; activityValue: number }): Promise<ActivityLog> => {
    return await apiRequest<ActivityLog>('/wellness/logs', {
      method: 'POST',
      body: JSON.stringify(log)
    });
  },
  
  verifyLog: async (id: number, approve: boolean): Promise<void> => {
    await apiRequest<void>(`/wellness/logs/${id}/verify?approve=${approve}`, {
      method: 'POST'
    });
  },
  
  fetchLeaderboard: async (): Promise<any[]> => {
    return await apiRequest<any[]>('/wellness/leaderboard');
  },
  
  fetchEapServices: async (): Promise<EAPService[]> => {
    return await apiRequest<EAPService[]>('/wellness/eap/services');
  },
  
  fetchMySessions: async (): Promise<EAPSession[]> => {
    return await apiRequest<EAPSession[]>('/wellness/eap/my-sessions');
  },
  
  fetchSessions: async (): Promise<EAPSession[]> => {
    return await apiRequest<EAPSession[]>('/wellness/eap/sessions');
  },
  
  bookEapSession: async (session: { serviceID: number; sessionDate: string }): Promise<EAPSession> => {
    return await apiRequest<EAPSession>('/wellness/eap/book', {
      method: 'POST',
      body: JSON.stringify(session)
    });
  },
  
  updateSessionStatus: async (id: number, status: string, counsellorRef: string): Promise<void> => {
    await apiRequest<void>(`/wellness/eap/sessions/${id}/status?status=${status}&counsellorRef=${counsellorRef}`, {
      method: 'POST'
    });
  }
};

// Rewards, Vouchers, & Analytics Reports API
export const rewardsApi = {
  fetchAwards: async (): Promise<RecognitionAward[]> => {
    return await apiRequest<RecognitionAward[]>('/rewards/awards');
  },
  
  nominatePeer: async (award: { recipientID: string; category: string; badgeName: string; message: string }): Promise<RecognitionAward> => {
    return await apiRequest<RecognitionAward>('/rewards/awards', {
      method: 'POST',
      body: JSON.stringify(award)
    });
  },
  
  fetchMyPoints: async (): Promise<RewardPoints> => {
    return await apiRequest<RewardPoints>('/rewards/points/my');
  },
  
  fetchCatalog: async (): Promise<RedemptionCatalog[]> => {
    return await apiRequest<RedemptionCatalog[]>('/rewards/catalog');
  },
  
  createCatalogItem: async (item: Partial<RedemptionCatalog>): Promise<RedemptionCatalog> => {
    return await apiRequest<RedemptionCatalog>('/rewards/catalog', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },
  
  redeemItem: async (itemId: number): Promise<void> => {
    await apiRequest<void>('/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ itemID: itemId })
    });
  },
  
  fetchNotifications: async (): Promise<Notification[]> => {
    return await apiRequest<Notification[]>('/rewards/notifications/my');
  },
  
  readNotification: async (id: number): Promise<void> => {
    await apiRequest<void>(`/rewards/notifications/${id}/read`, {
      method: 'POST'
    });
  },

  approveCatalogItem: async (id: number): Promise<void> => {
    await apiRequest<void>(`/rewards/catalog/${id}/approve`, {
      method: 'POST'
    });
  },

  rejectCatalogItem: async (id: number): Promise<void> => {
    await apiRequest<void>(`/rewards/catalog/${id}/reject`, {
      method: 'POST'
    });
  },
  
  generateReport: async (scope: string): Promise<BenefitsReport> => {
    return await apiRequest<BenefitsReport>(`/reports/generate?scope=${scope}`);
  },
  
  fetchReportsHistory: async (): Promise<BenefitsReport[]> => {
    return await apiRequest<BenefitsReport[]>('/reports/history');
  }
};
