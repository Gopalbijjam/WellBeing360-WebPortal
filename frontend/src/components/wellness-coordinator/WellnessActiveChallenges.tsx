import React from 'react';
import { Trophy } from 'lucide-react';
import type { WellnessChallenge } from '../../types';

interface WellnessActiveChallengesProps {
  challenges: WellnessChallenge[];
}

export const WellnessActiveChallenges: React.FC<WellnessActiveChallengesProps> = ({
  challenges
}) => {
  return (
    <div className="glass-panel" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.04)' }}>
      <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 16, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Trophy size={16} style={{ color: '#f59e0b' }} /> Active Challenges
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '200px', overflowY: 'auto', paddingRight: 4 }}>
        {challenges.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '16px 0' }}>No challenges launched yet.</p>
        ) : challenges.map(c => (
          <div key={c.challengeID} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>{c.challengeName}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.activityType} · Target {c.dailyTarget}</div>
            </div>
            <span className="badge badge-primary">+{c.pointsPerCompletion} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};
