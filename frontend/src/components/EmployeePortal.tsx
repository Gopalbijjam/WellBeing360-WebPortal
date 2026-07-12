import React, { useState } from 'react';
import { 
  Heart, Activity, Calendar, Award, Star, Plus, ShieldAlert, Trash2
} from 'lucide-react';
import type { 
  User, BenefitPlan, BenefitEnrolment, EnrolmentWindow, WellnessChallenge, ActivityLog, 
  EAPService, EAPSession, RecognitionAward, RewardPoints, RedemptionCatalog 
} from '../types';

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
  // Enrolment state
  const [enrolPlanID, setEnrolPlanID] = useState<number>(plans[0]?.planID || 1);
  const [enrolCoverage, setEnrolCoverage] = useState<string>('Individual');
  const [includeDeps, setIncludeDeps] = useState<boolean>(false);
  const [depsInput, setDepsInput] = useState<any[]>([{ name: '', relationship: 'Spouse', dob: '' }]);

  // Wellness state
  const [newLogValue, setNewLogValue] = useState<number>(0);
  const [selectedChallengeID, setSelectedChallengeID] = useState<number>(challenges[0]?.challengeID || 1);

  // EAP Booking State
  const [eapServiceID, setEapServiceID] = useState<number>(eapServices[0]?.serviceID || 1);
  const [eapDate, setEapDate] = useState('');

  // Nominate state
  const [nomineeID, setNomineeID] = useState('');
  const [awardCategory, setAwardCategory] = useState('PeerRecognition');
  const [awardBadge, setAwardBadge] = useState('🌟 Rockstar Colleague');
  const [awardMessage, setAwardMessage] = useState('');

  const handleAddEnrolDep = () => {
    setDepsInput([...depsInput, { name: '', relationship: 'Spouse', dob: '' }]);
  };

  const handleRemoveEnrolDep = (index: number) => {
    setDepsInput(depsInput.filter((_, i) => i !== index));
  };

  const handleEnrolFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEnrolment(enrolPlanID, enrolCoverage, includeDeps, depsInput);
  };

  const handleLogActivityFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitActivityLog(selectedChallengeID, newLogValue);
    setNewLogValue(0);
  };

  const handleEapBookFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookEapSession(eapServiceID, eapDate);
    setEapDate('');
  };

  const handleNominationFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nominatePeer(nomineeID, awardCategory, awardBadge, awardMessage);
    setNomineeID('');
    setAwardMessage('');
  };

  if (activeTab === 'home') {
    const activeEnrolmentCount = myEnrolments.filter(e => e.status === 'Active' || e.status === 'Submitted').length;

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Hello, {user.name} 👋</h2>
            <p style={{ color: 'hsl(var(--text-muted))' }}>Here is a summary of your wellness and benefits.</p>
          </div>
          {points && (
            <div className="points-pill">
              <Star size={16} fill="black" />
              <span>{points.balance} Points Available</span>
            </div>
          )}
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Heart size={24} />
            </div>
            <div className="stat-info">
              <h3>My Benefits</h3>
              <p>{activeEnrolmentCount} Active Plan(s)</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <Activity size={24} />
            </div>
            <div className="stat-info">
              <h3>Wellness Progress</h3>
              <p>{myLogs.length} Activities Logged</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon secondary">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <h3>EAP Sessions</h3>
              <p>{mySessions.length} Booked</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 30 }}>
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="btn btn-primary" onClick={() => setActiveTab('enrolment')}>
                <Plus size={16} /> Enrol in a Benefit Plan
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('wellness')}>
                <Activity size={16} /> Log Wellness Activity
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('eap')}>
                <Calendar size={16} /> Book EAP Counselling Session
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('recognition')}>
                <Award size={16} /> Nominate a Colleague
              </button>
            </div>
          </div>

          <div className="glass-panel">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Recent Wellness Submissions</h3>
            {myLogs.length === 0 ? (
              <p style={{ color: 'hsl(var(--text-muted))' }}>No recent activity logs. Submit steps, meditation, or hydration logs to earn points!</p>
            ) : (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Activity Value</th>
                      <th>Points</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLogs.slice(0, 5).map(l => (
                      <tr key={l.logID}>
                        <td>{new Date(l.logDate).toLocaleDateString()}</td>
                        <td>{l.activityValue}</td>
                        <td>+{l.pointsEarned}</td>
                        <td>
                          <span className={`badge ${l.status === 'Verified' ? 'badge-success' : 'badge-warning'}`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'enrolment') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 30 }}>
        {/* Active Catalog */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Available Benefits Catalog</h3>
          {(() => {
            const openWindow = windows.find(w => w.status === 'Open');
            return openWindow ? (
              <div style={{ padding: 14, border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 10, background: 'rgba(16, 185, 129, 0.06)', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <div>
                  <strong style={{ color: '#10b981' }}>Enrolment Window Open — Plan Year {openWindow.planYear}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', margin: '4px 0 0 0' }}>
                    Open from {new Date(openWindow.openDate).toLocaleDateString()} to {new Date(openWindow.closeDate).toLocaleDateString()} · Eligible Grades: {openWindow.eligibleGrades}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ padding: 14, border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 10, background: 'rgba(239, 68, 68, 0.05)', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: '1.2rem' }}>🔒</span>
                <div>
                  <strong style={{ color: '#ef4444' }}>No Enrolment Window Currently Open</strong>
                  <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', margin: '4px 0 0 0' }}>Please contact HR Benefits Administration for the next enrollment period.</p>
                </div>
              </div>
            );
          })()}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {plans.map(p => (
              <div key={p.planID} style={{ padding: 20, border: '1px solid var(--glass-border)', borderRadius: 12, background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontWeight: 700 }}>{p.planName}</h4>
                  <span className="badge badge-info">{p.planType}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', marginBottom: 12 }}>Grade Eligibility: {p.eligibilityGrade}</p>
                <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem' }}>
                  <div><strong>Your Cost:</strong> ${p.employeeContribution}/mo</div>
                  <div><strong>Employer Paid:</strong> ${p.employerContribution}/mo</div>
                  <div><strong>Coverage Limit:</strong> ${p.coverageLimit.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrolment Wizard */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Benefits Enrolment Wizard</h3>
          <form onSubmit={handleEnrolFormSubmit}>
            <div className="form-group">
              <label className="form-label">Select Benefit Plan</label>
              <select className="form-select" value={enrolPlanID} onChange={e => setEnrolPlanID(Number(e.target.value))}>
                {plans.map(p => (
                  <option key={p.planID} value={p.planID}>{p.planName} (${p.employeeContribution}/mo)</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Coverage Option</label>
              <select className="form-select" value={enrolCoverage} onChange={e => setEnrolCoverage(e.target.value)}>
                <option value="Individual">Individual (Self Only)</option>
                <option value="SpouseOnly">Spouse Only</option>
                <option value="Family">Family Coverage</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
                <input type="checkbox" checked={includeDeps} onChange={e => setIncludeDeps(e.target.checked)} />
                Include Dependents
              </label>
            </div>

            {includeDeps && (
              <div style={{ marginBottom: 20, padding: 16, border: '1px solid var(--glass-border)', borderRadius: 10, background: 'rgba(0,0,0,0.15)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Dependents Details
                  <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={handleAddEnrolDep}>
                    + Add Row
                  </button>
                </h4>
                {depsInput.map((dep, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-end' }}>
                    <div style={{ flex: 2 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Name</label>
                      <input className="form-input" type="text" value={dep.name} placeholder="Full Name" onChange={e => {
                        const list = [...depsInput];
                        list[idx].name = e.target.value;
                        setDepsInput(list);
                      }} required />
                    </div>
                    <div style={{ flex: 1.5 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Relation</label>
                      <select className="form-select" value={dep.relationship} onChange={e => {
                        const list = [...depsInput];
                        list[idx].relationship = e.target.value;
                        setDepsInput(list);
                      }}>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Parent">Parent</option>
                      </select>
                    </div>
                    <div style={{ flex: 2 }}>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>DOB</label>
                      <input className="form-input" type="date" value={dep.dob} onChange={e => {
                        const list = [...depsInput];
                        list[idx].dob = e.target.value;
                        setDepsInput(list);
                      }} required />
                    </div>
                    {depsInput.length > 1 && (
                      <button type="button" className="btn btn-danger" style={{ padding: 12, borderRadius: 10 }} onClick={() => handleRemoveEnrolDep(idx)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Submit Enrolment Form
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (activeTab === 'wellness') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 30 }}>
        {/* Submit Activity */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Log Daily Wellness Progress</h3>
          <form onSubmit={handleLogActivityFormSubmit}>
            <div className="form-group">
              <label className="form-label">Select Active Challenge</label>
              <select className="form-select" value={selectedChallengeID} onChange={e => setSelectedChallengeID(Number(e.target.value))}>
                {challenges.map(c => (
                  <option key={c.challengeID} value={c.challengeID}>{c.challengeName} (Target: {c.dailyTarget} {c.activityType === 'Steps' ? 'Steps' : c.activityType === 'WaterIntake' ? 'Glasses' : 'Mins'})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Logged Value</label>
              <input className="form-input" type="number" value={newLogValue} onChange={e => setNewLogValue(Number(e.target.value))} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Progress Log</button>
          </form>

          <h4 style={{ fontWeight: 700, marginTop: 30, marginBottom: 12 }}>Wellness Challenges Catalog</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {challenges.map(c => (
              <div key={c.challengeID} style={{ padding: 16, border: '1px solid var(--glass-border)', borderRadius: 10, background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ fontWeight: 700 }}>{c.challengeName}</h5>
                  <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Target: {c.dailyTarget} {c.activityType}</p>
                </div>
                <span className="badge badge-success">+{c.pointsPerCompletion} Points</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Sprint Leaderboard</h3>
          <div className="table-wrapper">
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
  }

  if (activeTab === 'eap') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 30 }}>
        {/* Booking Request */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Confidential EAP Counselling Booking</h3>
          <div style={{ padding: 16, border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 10, background: 'rgba(239, 68, 68, 0.05)', display: 'flex', gap: 12, marginBottom: 20 }}>
            <ShieldAlert size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
              <strong>Strict Privacy Controls:</strong> All EAP counselling bookings are strictly confidential. Individual identities are anonymised in HR and financial reports. Your personal records are securely logs protected.
            </p>
          </div>

          <form onSubmit={handleEapBookFormSubmit}>
            <div className="form-group">
              <label className="form-label">Select EAP Counselling Service</label>
              <select className="form-select" value={eapServiceID} onChange={e => setEapServiceID(Number(e.target.value))}>
                {eapServices.map(s => (
                  <option key={s.serviceID} value={s.serviceID}>{s.serviceName} (Max: {s.sessionsAllowedPerEmployee} sessions/yr)</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Session Date & Time</label>
              <input className="form-input" type="datetime-local" value={eapDate} onChange={e => setEapDate(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Book Session Request</button>
          </form>
        </div>

        {/* Bookings Status */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>My Counselling Appointments</h3>
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Service ID</th>
                  <th>Date</th>
                  <th>Counsellor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mySessions.map(s => (
                  <tr key={s.sessionID}>
                    <td>Service #{s.serviceID}</td>
                    <td>{new Date(s.sessionDate).toLocaleString()}</td>
                    <td>{s.counsellorRef}</td>
                    <td>
                      <span className={`badge ${s.status === 'Scheduled' ? 'badge-info' : s.status === 'Completed' ? 'badge-success' : s.status === 'Requested' ? 'badge-warning' : 'badge-danger'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'recognition') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 30 }}>
        {/* Nominate Colleague */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Nominate & Congratulate a Peer</h3>
          <form onSubmit={handleNominationFormSubmit}>
            <div className="form-group">
              <label className="form-label">Recipient Employee ID</label>
              <input className="form-input" type="text" placeholder="e.g. EMP-928103" value={nomineeID} onChange={e => setNomineeID(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Recognition Category</label>
              <select className="form-select" value={awardCategory} onChange={e => setAwardCategory(e.target.value)}>
                <option value="PeerRecognition">Peer-to-Peer Recognition (+50 points)</option>
                <option value="ManagerNomination">Manager Nomination (+150 points)</option>
                <option value="InnovationAward">Innovation Spotlight (+250 points)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Award Badge Icon</label>
              <select className="form-select" value={awardBadge} onChange={e => setAwardBadge(e.target.value)}>
                <option value="🌟 Rockstar Colleague">🌟 Rockstar Colleague</option>
                <option value="🚀 Innovation Pioneer">🚀 Innovation Pioneer</option>
                <option value="🤝 Leadership Pillar">🤝 Team Leadership Pillar</option>
                <option value="💡 Critical Thinker">💡 Critical Thinker</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Convey a Thank You Message</label>
              <textarea className="form-input" rows={4} placeholder="Type your congrats details..." value={awardMessage} onChange={e => setAwardMessage(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Nominate & Award Points</button>
          </form>
        </div>

        {/* Wall of fame feed */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Public Recognition Wall</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '600px', overflowY: 'auto', paddingRight: 10 }}>
            {awards.length === 0 ? (
              <p style={{ color: 'hsl(var(--text-muted))' }}>No peer awards sent yet. Be the first to appreciate someone!</p>
            ) : (
              awards.map(aw => (
                <div key={aw.awardID} style={{ padding: 20, border: '1px solid var(--glass-border)', borderRadius: 12, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.3rem' }}>{aw.badgeName.split(' ')[0]}</span>
                      <strong style={{ fontSize: '0.95rem' }}>{aw.nominatorID} ➔ {aw.recipientID}</strong>
                    </div>
                    <span className="badge badge-primary">{aw.category}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'hsl(var(--text-main))', marginBottom: 8 }}>"{aw.message}"</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                    <span>{new Date(aw.awardDate).toLocaleDateString()}</span>
                    <span style={{ color: '#fbbf24', fontWeight: 700 }}>+{aw.pointsAwarded} points</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'rewards') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Employee Rewards & Gift Redemption Catalog</h3>
            <p style={{ color: 'hsl(var(--text-muted))' }}>Redeem your wellness points for physical gifts, vouchers, and charitable donations.</p>
          </div>
          {points && (
            <div className="points-pill">
              <Star size={16} fill="black" />
              <span>{points.balance} Points Balance</span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {catalog.map(item => (
            <div key={item.itemID} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 0 }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: 12 }}>{item.category}</span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8 }}>{item.itemName}</h4>
                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginBottom: 16 }}>Available Quantity: {item.availableQuantity}</p>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>{item.pointsRequired} pts</span>
                  <span className={`badge ${item.status === 'Available' ? 'badge-success' : 'badge-danger'}`}>{item.status}</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} disabled={item.status !== 'Available' || (points ? points.balance < item.pointsRequired : true)} onClick={() => redeemItem(item.itemID)}>
                  Redeem Gift
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
