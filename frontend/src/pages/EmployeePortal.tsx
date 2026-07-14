import React from 'react';
import type { 
  User, BenefitPlan, BenefitEnrolment, EnrolmentWindow, WellnessChallenge, ActivityLog, 
  EAPService, EAPSession, RecognitionAward, RewardPoints, RedemptionCatalog 
} from '../types';

import { EmployeeDashboardHome } from '../components/employee/EmployeeDashboardHome';
import { EmployeeBenefitsTab } from '../components/employee/EmployeeBenefitsTab';
import { EmployeeWellnessTab } from '../components/employee/EmployeeWellnessTab';
import { EmployeeEapTab } from '../components/employee/EmployeeEapTab';
import { EmployeeRecognitionTab } from '../components/employee/EmployeeRecognitionTab';
import { EmployeeRewardsTab } from '../components/employee/EmployeeRewardsTab';

interface EmployeePortalProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  points: RewardPoints | null;
  myLogs: ActivityLog[];
  mySessions: EAPSession[];
  myEnrolments: BenefitEnrolment[];
  plans: BenefitPlan[];
  windows: EnrolmentWindow[];
  challenges: WellnessChallenge[];
  leaderboard: any[];
  eapServices: EAPService[];
  awards: RecognitionAward[];
  catalog: RedemptionCatalog[];
  submitActivityLog: (challengeID: number, val: number) => Promise<void>;
  bookEapSession: (serviceID: number, date: string) => Promise<void>;
  submitEnrolment: (planID: number, coverage: string, includeDeps: boolean, deps: any[]) => Promise<void>;
  nominatePeer: (recipientID: string, category: string, badge: string, message: string) => Promise<void>;
  redeemItem: (itemID: number) => Promise<void>;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  user,
  activeTab,
  setActiveTab,
  points,
  myLogs,
  mySessions,
  myEnrolments,
  plans,
  windows,
  challenges,
  leaderboard,
  eapServices,
  awards,
  catalog,
  submitActivityLog,
  bookEapSession,
  submitEnrolment,
  nominatePeer,
  redeemItem
}) => {
  switch (activeTab) {
    case 'home':
      return (
        <EmployeeDashboardHome
          user={user}
          points={points}
          myEnrolments={myEnrolments}
          myLogs={myLogs}
          mySessions={mySessions}
          setActiveTab={setActiveTab}
        />
      );
    case 'enrolment':
      return (
        <EmployeeBenefitsTab
          plans={plans}
          windows={windows}
          myEnrolments={myEnrolments}
          submitEnrolment={submitEnrolment}
        />
      );
    case 'wellness':
      return (
        <EmployeeWellnessTab
          user={user}
          challenges={challenges}
          myLogs={myLogs}
          leaderboard={leaderboard}
          submitActivityLog={submitActivityLog}
        />
      );
    case 'eap':
      return (
        <EmployeeEapTab
          eapServices={eapServices}
          mySessions={mySessions}
          bookEapSession={bookEapSession}
        />
      );
    case 'recognition':
      return (
        <EmployeeRecognitionTab
          awards={awards}
          nominatePeer={nominatePeer}
        />
      );
    case 'rewards':
      return (
        <EmployeeRewardsTab
          points={points}
          catalog={catalog}
          redeemItem={redeemItem}
        />
      );
    default:
      return null;
  }
};
