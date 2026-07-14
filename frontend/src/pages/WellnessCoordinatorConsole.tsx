import React from 'react';
import type { WellnessProgram, WellnessChallenge, ActivityLog } from '../types';

import { WellnessDashboardActions } from '../components/wellness-coordinator/WellnessDashboardActions';
import { WellnessActiveChallenges } from '../components/wellness-coordinator/WellnessActiveChallenges';
import { WellnessLogsVerifier } from '../components/wellness-coordinator/WellnessLogsVerifier';

interface WellnessCoordinatorConsoleProps {
  programs: WellnessProgram[];
  challenges: WellnessChallenge[];
  pendingLogs: ActivityLog[];
  createProgram: (prog: Partial<WellnessProgram>) => Promise<void>;
  createChallenge: (chal: Partial<WellnessChallenge>) => Promise<void>;
  verifyLog: (id: number, approve: boolean) => Promise<void>;
}

export const WellnessCoordinatorConsole: React.FC<WellnessCoordinatorConsoleProps> = ({
  programs,
  challenges,
  pendingLogs,
  createProgram,
  createChallenge,
  verifyLog
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 30 }}>
      {/* Left Panel — Management Actions + Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <WellnessDashboardActions
          programs={programs}
          challenges={challenges}
          pendingLogs={pendingLogs}
          createProgram={createProgram}
          createChallenge={createChallenge}
        />

        <WellnessActiveChallenges
          challenges={challenges}
        />
      </div>

      {/* Right Panel — Verification Queue */}
      <WellnessLogsVerifier
        pendingLogs={pendingLogs}
        verifyLog={verifyLog}
      />
    </div>
  );
};
