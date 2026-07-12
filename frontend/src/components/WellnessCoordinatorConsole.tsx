import React, { useState } from 'react';
import type { WellnessProgram, WellnessChallenge, ActivityLog } from '../types';

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
  const [newProgName, setNewProgName] = useState('');
  const [newProgTheme, setNewProgTheme] = useState('Fitness');
  const [newProgPoints, setNewProgPoints] = useState(500);

  const [newChalName, setNewChalName] = useState('');
  const [newChalType, setNewChalType] = useState('Steps');
  const [newChalTarget, setNewChalTarget] = useState(10000);
  const [newChalPoints, setNewChalPoints] = useState(100);

  const handleProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProgram({
      name: newProgName,
      theme: newProgTheme,
      pointsOnOffer: newProgPoints,
      targetParticipation: 100,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: "Active"
    }).then(() => {
      setNewProgName('');
    });
  };

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createChallenge({
      programID: 1,
      challengeName: newChalName,
      activityType: newChalType,
      dailyTarget: newChalTarget,
      duration: 30,
      pointsPerCompletion: newChalPoints,
      status: "Active"
    }).then(() => {
      setNewChalName('');
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 30 }}>
      {/* Create panel */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Wellness Management Console</h3>
        
        <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: 16, marginBottom: 16 }}>
          <h4 style={{ fontWeight: 700, marginBottom: 12 }}>Launch Wellness Program</h4>
          <form onSubmit={handleProgramSubmit}>
            <div className="form-group">
              <label className="form-label">Program Name</label>
              <input className="form-input" type="text" value={newProgName} onChange={e => setNewProgName(e.target.value)} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Theme</label>
                <select className="form-select" value={newProgTheme} onChange={e => setNewProgTheme(e.target.value)}>
                  <option value="Fitness">Fitness</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="MentalHealth">Mental Health</option>
                  <option value="Preventive">Preventive</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Total Points Budget</label>
                <input className="form-input" type="number" value={newProgPoints} onChange={e => setNewProgPoints(Number(e.target.value))} required />
              </div>
            </div>
            <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>Launch Program</button>
          </form>
        </div>

        <div>
          <h4 style={{ fontWeight: 700, marginBottom: 12 }}>Launch Wellness Challenge</h4>
          <form onSubmit={handleChallengeSubmit}>
            <div className="form-group">
              <label className="form-label">Challenge Name</label>
              <input className="form-input" type="text" value={newChalName} onChange={e => setNewChalName(e.target.value)} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Activity Type</label>
                <select className="form-select" value={newChalType} onChange={e => setNewChalType(e.target.value)}>
                  <option value="Steps">Steps</option>
                  <option value="Meditation">Meditation</option>
                  <option value="WaterIntake">Water Intake</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Daily Target</label>
                <input className="form-input" type="number" value={newChalTarget} onChange={e => setNewChalTarget(Number(e.target.value))} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Points Per Completion</label>
              <input className="form-input" type="number" value={newChalPoints} onChange={e => setNewChalPoints(Number(e.target.value))} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Launch Challenge</button>
          </form>
        </div>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--glass-border)' }}>
          <h4 style={{ fontWeight: 700, marginBottom: 12 }}>Active Programs & Challenges</h4>
          <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginBottom: 10 }}>
            Currently managing {programs.length} programs and {challenges.length} active challenges.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {challenges.slice(0, 3).map(c => (
              <div key={c.challengeID} style={{ fontSize: '0.85rem', padding: '8px 12px', border: '1px solid var(--glass-border)', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.challengeName}</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>+{c.pointsPerCompletion} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification queue */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Activity Verification Queue</h3>
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Challenge</th>
                <th>Value</th>
                <th>Points</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingLogs.map(l => (
                <tr key={l.logID}>
                  <td>{l.employeeID}</td>
                  <td>Challenge #{l.challengeID}</td>
                  <td>{l.activityValue}</td>
                  <td>+{l.pointsEarned}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => verifyLog(l.logID, true)}>
                        Verify
                      </button>
                      <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => verifyLog(l.logID, false)}>
                        Deny
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
