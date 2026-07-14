import React, { useState } from 'react';
import type { BenefitPlan, EnrolmentWindow, BenefitEnrolment } from '../types';

import { BenefitsPlansTab } from '../components/hr-benefits/BenefitsPlansTab';
import { EnrolmentWindowsTab } from '../components/hr-benefits/EnrolmentWindowsTab';
import { EnrolmentsVerifierTab } from '../components/hr-benefits/EnrolmentsVerifierTab';

interface HRBenefitsConsoleProps {
  plans: BenefitPlan[];
  windows: EnrolmentWindow[];
  allEnrolments: BenefitEnrolment[];
  createPlan: (plan: Partial<BenefitPlan>) => Promise<void>;
  createWindow: (window: Partial<EnrolmentWindow>) => Promise<void>;
  verifyEnrolment: (id: number, status: string) => Promise<void>;
}

export const HRBenefitsConsole: React.FC<HRBenefitsConsoleProps> = ({
  plans,
  windows,
  allEnrolments,
  createPlan,
  createWindow,
  verifyEnrolment
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'plans' | 'windows' | 'enrolments'>('plans');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>HR Benefits Configurator & Enrolments Panel</h3>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeAdminTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveAdminTab('plans')}>Benefit Plans</button>
        <button className={`tab-btn ${activeAdminTab === 'windows' ? 'active' : ''}`} onClick={() => setActiveAdminTab('windows')}>Enrolment Windows</button>
        <button className={`tab-btn ${activeAdminTab === 'enrolments' ? 'active' : ''}`} onClick={() => setActiveAdminTab('enrolments')}>Employee Enrolments</button>
      </div>

      {activeAdminTab === 'plans' && (
        <BenefitsPlansTab
          plans={plans}
          createPlan={createPlan}
        />
      )}

      {activeAdminTab === 'windows' && (
        <EnrolmentWindowsTab
          windows={windows}
          createWindow={createWindow}
        />
      )}

      {activeAdminTab === 'enrolments' && (
        <EnrolmentsVerifierTab
          allEnrolments={allEnrolments}
          verifyEnrolment={verifyEnrolment}
        />
      )}
    </div>
  );
};
