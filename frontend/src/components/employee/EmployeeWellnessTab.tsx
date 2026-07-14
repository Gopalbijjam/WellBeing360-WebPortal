import React, { useState, useEffect } from 'react';
import type { User, WellnessChallenge, ActivityLog } from '../../types';

interface EmployeeWellnessTabProps {
  user: User;
  challenges: WellnessChallenge[];
  myLogs: ActivityLog[];
  leaderboard: any[];
  submitActivityLog: (challengeID: number, activityValue: number) => Promise<void>;
}

export const EmployeeWellnessTab: React.FC<EmployeeWellnessTabProps> = ({
  user,
  challenges,
  myLogs,
  leaderboard,
  submitActivityLog
}) => {
  const [newLogValue, setNewLogValue] = useState<number>(0);
  const [enrolledChallenges, setEnrolledChallenges] = useState<number[]>(() => {
    const saved = localStorage.getItem(`enrolled_challenges_${user.employeeID}`);
    return saved ? JSON.parse(saved) : [];
  });

  const enrolledChallengeIds = Array.from(new Set([
    ...enrolledChallenges,
    ...myLogs.map(l => l.challengeID)
  ]));

  const [selectedChallengeID, setSelectedChallengeID] = useState<number>(() => {
    return enrolledChallengeIds[0] || (challenges[0]?.challengeID || 1);
  });

  useEffect(() => {
    if (enrolledChallengeIds.length > 0 && !enrolledChallengeIds.includes(selectedChallengeID)) {
      setSelectedChallengeID(enrolledChallengeIds[0]);
    }
  }, [enrolledChallengeIds, selectedChallengeID]);

  const handleEnrolChallenge = (challengeID: number) => {
    const updated = [...enrolledChallenges, challengeID];
    setEnrolledChallenges(updated);
    localStorage.setItem(`enrolled_challenges_${user.employeeID}`, JSON.stringify(updated));
  };

  const handleLogActivityFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitActivityLog(selectedChallengeID, newLogValue);
    setNewLogValue(0);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 30 }}>
      {/* Submit Activity */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Log Daily Wellness Progress</h3>
        <form onSubmit={handleLogActivityFormSubmit}>
          <div className="form-group">
            <label className="form-label">Select Active Challenge</label>
            <select 
              className="form-select" 
              value={selectedChallengeID} 
              onChange={e => setSelectedChallengeID(Number(e.target.value))}
              disabled={enrolledChallengeIds.length === 0}
            >
              {enrolledChallengeIds.length === 0 ? (
                <option value="">-- No Enrolled Challenges --</option>
              ) : (
                challenges
                  .filter(c => enrolledChallengeIds.includes(c.challengeID))
                  .map(c => (
                    <option key={c.challengeID} value={c.challengeID}>{c.challengeName} (Target: {c.dailyTarget} {c.activityType === 'Steps' ? 'Steps' : c.activityType === 'WaterIntake' ? 'Glasses' : 'Mins'})</option>
                  ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Logged Value</label>
            <input 
              className="form-input" 
              type="number" 
              value={newLogValue} 
              onChange={e => setNewLogValue(Number(e.target.value))} 
              disabled={enrolledChallengeIds.length === 0} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={enrolledChallengeIds.length === 0}
          >
            {enrolledChallengeIds.length === 0 ? 'Enrol in a Challenge First' : 'Submit Progress Log'}
          </button>
        </form>

        <h4 style={{ fontWeight: 700, marginTop: 30, marginBottom: 12 }}>Wellness Challenges Catalog</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '220px', overflowY: 'auto', paddingRight: '6px' }}>
          {challenges.map(c => {
            const isEnrolled = enrolledChallengeIds.includes(c.challengeID);
            return (
              <div key={c.challengeID} style={{ padding: 16, border: '1px solid var(--glass-border)', borderRadius: 10, background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ fontWeight: 700 }}>{c.challengeName}</h5>
                  <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', margin: '4px 0 0 0' }}>
                    Target: {c.dailyTarget} {c.activityType === 'Steps' ? 'Steps' : c.activityType === 'WaterIntake' ? 'Glasses' : 'Mins'} | <span style={{ color: '#10b981', fontWeight: 600 }}>+{c.pointsPerCompletion} pts</span>
                  </p>
                </div>
                <div>
                  {isEnrolled ? (
                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                      ✓ Enrolled
                    </span>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, borderRadius: 8 }}
                      onClick={() => handleEnrolChallenge(c.challengeID)}
                    >
                      Enrol
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Sprint Leaderboard</h3>
        <div className="table-wrapper" style={{ maxHeight: '360px', overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Employee ID</th>
                <th>Total Points</th>
                <th>Tasks Met</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, idx) => (
                <tr key={item.employeeID} style={item.employeeID === user.employeeID ? { background: 'hsla(var(--primary)/0.1)' } : {}}>
                  <td>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.employeeID} {item.employeeID === user.employeeID && '(You)'}</td>
                  <td style={{ color: '#fbbf24', fontWeight: 700 }}>{item.totalPoints} pts</td>
                  <td>{item.activitiesCompleted} logs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
