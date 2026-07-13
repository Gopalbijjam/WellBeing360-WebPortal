import React, { useState } from 'react';
import { ShieldCheck, Flame, CheckCircle, XCircle, X, Zap, Target, Trophy, LayoutGrid } from 'lucide-react';
import type { WellnessProgram, WellnessChallenge, ActivityLog } from '../types';

interface WellnessCoordinatorConsoleProps {
  programs: WellnessProgram[];
  challenges: WellnessChallenge[];
  pendingLogs: ActivityLog[];
  createProgram: (prog: Partial<WellnessProgram>) => Promise<void>;
  createChallenge: (chal: Partial<WellnessChallenge>) => Promise<void>;
  verifyLog: (id: number, approve: boolean) => Promise<void>;
}

type ModalType = 'program' | 'challenge' | null;

export const WellnessCoordinatorConsole: React.FC<WellnessCoordinatorConsoleProps> = ({
  programs,
  challenges,
  pendingLogs,
  createProgram,
  createChallenge,
  verifyLog
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newProgName, setNewProgName] = useState('');
  const [newProgTheme, setNewProgTheme] = useState('Fitness');
  const [newProgPoints, setNewProgPoints] = useState(500);

  const [newChalName, setNewChalName] = useState('');
  const [newChalType, setNewChalType] = useState('Steps');
  const [newChalTarget, setNewChalTarget] = useState(10000);
  const [newChalPoints, setNewChalPoints] = useState(100);
  const [selectedProgramID, setSelectedProgramID] = useState<number>(0);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const closeModal = () => {
    setActiveModal(null);
    setIsSubmitting(false);
  };

  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createProgram({
        name: newProgName,
        theme: newProgTheme,
        pointsOnOffer: newProgPoints,
        targetParticipation: 100,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        status: "Active"
      });
      setNewProgName('');
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const targetProgId = selectedProgramID || (programs.length > 0 ? programs[0].programID : 1);
      await createChallenge({
        programID: targetProgId,
        challengeName: newChalName,
        activityType: newChalType,
        dailyTarget: newChalTarget,
        duration: 30,
        pointsPerCompletion: newChalPoints,
        status: "Active"
      });
      setNewChalName('');
      setSelectedProgramID(0);
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (id: string) => ({
    width: '100%',
    padding: '10px 14px',
    height: '44px',
    borderRadius: '10px',
    background: '#ffffff',
    border: focusedInput === id ? '1.5px solid #00d09c' : '1px solid #cbd5e1',
    color: '#0f172a',
    fontFamily: 'inherit',
    fontSize: '0.92rem',
    outline: 'none',
    boxShadow: focusedInput === id ? '0 0 0 3px rgba(0,208,156,0.1)' : 'none',
    transition: 'all 0.15s ease-in-out'
  });

  const getSelectStyle = (id: string) => ({
    ...getInputStyle(id),
    padding: '0 40px 0 14px',
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat',
  });

  return (
    <>
      {/* ── Modal overlay ── */}
      {activeModal && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
            animation: 'fadeIn 0.15s ease'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 24,
              padding: 40,
              width: '100%',
              maxWidth: 480,
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.25)',
              border: '1px solid rgba(0,0,0,0.06)',
              animation: 'slideInUp 0.2s ease'
            }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,208,156,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeModal === 'program' ? <LayoutGrid size={20} style={{ color: '#00d09c' }} /> : <Target size={20} style={{ color: '#00d09c' }} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {activeModal === 'program' ? 'Launch Wellness Program' : 'Launch Wellness Challenge'}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    {activeModal === 'program' ? 'Configure and publish a new wellness campaign' : 'Set up a new challenge for employees'}
                  </p>
                </div>
              </div>
              <button onClick={closeModal} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b', transition: 'all 0.15s' }}>
                <X size={18} />
              </button>
            </div>

            {/* Program Form */}
            {activeModal === 'program' && (
              <form onSubmit={handleProgramSubmit}>
                <div className="form-group" style={{ marginBottom: 18 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Program Name</label>
                  <input className="form-input" style={getInputStyle('progname')} type="text" placeholder="E.g., Winter Fitness Challenge"
                    value={newProgName} onChange={e => setNewProgName(e.target.value)}
                    onFocus={() => setFocusedInput('progname')} onBlur={() => setFocusedInput(null)} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Theme</label>
                    <select className="form-select" style={getSelectStyle('progtheme')} value={newProgTheme} onChange={e => setNewProgTheme(e.target.value)}
                      onFocus={() => setFocusedInput('progtheme')} onBlur={() => setFocusedInput(null)}>
                      <option value="Fitness">Fitness</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="MentalHealth">Mental Health</option>
                      <option value="Preventive">Preventive</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Points Budget</label>
                    <input className="form-input" style={getInputStyle('progpts')} type="number" value={newProgPoints}
                      onChange={e => setNewProgPoints(Number(e.target.value))}
                      onFocus={() => setFocusedInput('progpts')} onBlur={() => setFocusedInput(null)} required />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={closeModal} className="btn btn-secondary" style={{ flex: 1, height: 44, borderRadius: 10, fontWeight: 700, border: '1px solid #cbd5e1', background: '#f8fafc' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 2, height: 44, borderRadius: 10, fontWeight: 700, background: 'linear-gradient(135deg, #00d09c, #00b587)', boxShadow: '0 4px 12px rgba(0,208,156,0.2)' }}>
                    {isSubmitting ? 'Launching...' : '🚀 Launch Program'}
                  </button>
                </div>
              </form>
            )}

            {/* Challenge Form */}
            {activeModal === 'challenge' && (
              <form onSubmit={handleChallengeSubmit}>
                <div className="form-group" style={{ marginBottom: 18 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Wellness Program</label>
                  <select 
                    className="form-select" 
                    style={getSelectStyle('chalprog')} 
                    value={selectedProgramID || (programs.length > 0 ? programs[0].programID : '')} 
                    onChange={e => setSelectedProgramID(Number(e.target.value))}
                    onFocus={() => setFocusedInput('chalprog')} 
                    onBlur={() => setFocusedInput(null)}
                    required
                  >
                    {programs.length === 0 ? (
                      <option value="">No Active Programs Available</option>
                    ) : programs.map(p => (
                      <option key={p.programID} value={p.programID}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 18 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Challenge Name</label>
                  <input className="form-input" style={getInputStyle('chalname')} type="text" placeholder="E.g., 10K Daily Walk Sprint"
                    value={newChalName} onChange={e => setNewChalName(e.target.value)}
                    onFocus={() => setFocusedInput('chalname')} onBlur={() => setFocusedInput(null)} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Activity Type</label>
                    <select className="form-select" style={getSelectStyle('chaltype')} value={newChalType} onChange={e => setNewChalType(e.target.value)}
                      onFocus={() => setFocusedInput('chaltype')} onBlur={() => setFocusedInput(null)}>
                      <option value="Steps">Steps</option>
                      <option value="Meditation">Meditation</option>
                      <option value="WaterIntake">Water Intake</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Daily Target</label>
                    <input className="form-input" style={getInputStyle('chaltarget')} type="number" value={newChalTarget}
                      onChange={e => setNewChalTarget(Number(e.target.value))}
                      onFocus={() => setFocusedInput('chaltarget')} onBlur={() => setFocusedInput(null)} required />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 28 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Points Per Completion</label>
                  <input className="form-input" style={getInputStyle('chalpts')} type="number" value={newChalPoints}
                    onChange={e => setNewChalPoints(Number(e.target.value))}
                    onFocus={() => setFocusedInput('chalpts')} onBlur={() => setFocusedInput(null)} required />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={closeModal} className="btn btn-secondary" style={{ flex: 1, height: 44, borderRadius: 10, fontWeight: 700, border: '1px solid #cbd5e1', background: '#f8fafc' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 2, height: 44, borderRadius: 10, fontWeight: 700, background: 'linear-gradient(135deg, #00d09c, #00b587)', boxShadow: '0 4px 12px rgba(0,208,156,0.2)' }}>
                    {isSubmitting ? 'Creating...' : '🏆 Launch Challenge'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Main Dashboard ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 30 }}>

        {/* Left Panel — Management Actions + Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Action Cards */}
          <div className="glass-panel" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 6, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Flame size={20} style={{ color: '#00d09c' }} /> Wellness Management Console
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: 28 }}>
              Managing <strong>{programs.length}</strong> programs and <strong>{challenges.length}</strong> active challenges.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              <button
                onClick={() => setActiveModal('program')}
                style={{
                  padding: '20px 16px', borderRadius: 16, background: 'rgba(0,208,156,0.04)', border: '1.5px dashed rgba(0,208,156,0.25)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,208,156,0.08)'; e.currentTarget.style.borderColor = '#00d09c'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,208,156,0.04)'; e.currentTarget.style.borderColor = 'rgba(0,208,156,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,208,156,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <LayoutGrid size={18} style={{ color: '#00b587' }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: 4 }}>New Program</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Create a wellness campaign</div>
              </button>

              <button
                onClick={() => setActiveModal('challenge')}
                style={{
                  padding: '20px 16px', borderRadius: 16, background: 'rgba(59,130,246,0.04)', border: '1.5px dashed rgba(59,130,246,0.25)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.04)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Target size={18} style={{ color: '#3b82f6' }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: 4 }}>New Challenge</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Set up a new activity sprint</div>
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { icon: <LayoutGrid size={16} />, label: 'Programs', value: programs.length, color: '#00d09c' },
                { icon: <Zap size={16} />, label: 'Challenges', value: challenges.length, color: '#3b82f6' },
                { icon: <ShieldCheck size={16} />, label: 'Pending', value: pendingLogs.length, color: pendingLogs.length > 0 ? '#f59e0b' : '#10b981' },
              ].map((s) => (
                <div key={s.label} style={{ padding: '14px 16px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Challenges List */}
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
        </div>

        {/* Right Panel — Verification Queue */}
        <div className="glass-panel" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <ShieldCheck size={20} style={{ color: '#00d09c' }} /> Activity Verification Queue
            </h3>
            {pendingLogs.length > 0 && (
              <span style={{ background: 'rgba(245,158,11,0.1)', color: '#d97706', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: '0.78rem', fontWeight: 700 }}>
                {pendingLogs.length} pending
              </span>
            )}
          </div>

          {pendingLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(16,185,129,0.06)', border: '1.5px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={30} style={{ color: '#10b981' }} />
              </div>
              <h4 style={{ fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>All Verified!</h4>
              <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: 280, margin: '0 auto' }}>
                No pending activity logs. All employee submissions have been reviewed.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, maxHeight: '520px', overflowY: 'auto', paddingRight: 4 }}>
              {pendingLogs.map(l => (
                <div key={l.logID} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 18, background: '#ffffff', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Employee ID</span>
                      <h5 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', marginTop: 2 }}>{l.employeeID}</h5>
                    </div>
                    <span className="badge badge-success" style={{ background: '#00b587', color: 'white', fontWeight: 700, borderRadius: 20, padding: '4px 10px', fontSize: '0.78rem' }}>
                      +{l.pointsEarned} pts
                    </span>
                  </div>
                  
                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Challenge</span>
                      <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.85rem' }}>Challenge #{l.challengeID}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Activity Value</span>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{l.activityValue}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button className="btn btn-success" style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 8, fontWeight: 700 }} onClick={() => verifyLog(l.logID, true)}>
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button className="btn btn-danger" style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 8, fontWeight: 700 }} onClick={() => verifyLog(l.logID, false)}>
                      <XCircle size={14} /> Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
