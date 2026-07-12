import React, { useState } from 'react';
import { X, Settings, Calendar, PlusCircle, Check, AlertCircle } from 'lucide-react';
import type { BenefitPlan, EnrolmentWindow, BenefitEnrolment } from '../types';

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

  // Modal display states
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isWindowModalOpen, setIsWindowModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Plan Form State
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanType, setNewPlanType] = useState('GroupHealthInsurance');
  const [newPlanGrades, setNewPlanGrades] = useState('G1,G2,G3');
  const [newPlanEmpCont, setNewPlanEmpCont] = useState(0);
  const [newPlanEmprCont, setNewPlanEmprCont] = useState(0);
  const [newPlanLimit, setNewPlanLimit] = useState(0);

  // Window Form State
  const [newWinYear, setNewWinYear] = useState(2026);
  const [newWinOpen, setNewWinOpen] = useState('');
  const [newWinClose, setNewWinClose] = useState('');
  const [newWinGrades, setNewWinGrades] = useState('G1,G2,G3,G4,G5,G6,G7');

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createPlan({
        planName: newPlanName,
        planType: newPlanType,
        eligibilityGrade: newPlanGrades,
        employeeContribution: newPlanEmpCont,
        employerContribution: newPlanEmprCont,
        coverageLimit: newPlanLimit,
        effectiveDate: new Date().toISOString().split('T')[0],
        status: "Active"
      });
      setNewPlanName('');
      setIsPlanModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWindowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createWindow({
        planYear: newWinYear,
        openDate: newWinOpen,
        closeDate: newWinClose,
        eligibleGrades: newWinGrades,
        status: "Open"
      });
      setNewWinOpen('');
      setNewWinClose('');
      setIsWindowModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (id: string) => ({
    width: '100%',
    padding: '10px 14px',
    height: '42px',
    borderRadius: '10px',
    background: '#ffffff',
    border: focusedInput === id ? '1.5px solid #00d09c' : '1px solid #cbd5e1',
    color: '#0f172a',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    outline: 'none',
    boxShadow: focusedInput === id ? '0 0 0 3px rgba(0, 208, 156, 0.08)' : 'none',
    transition: 'all 0.15s ease-in-out'
  });

  const getSelectStyle = (id: string) => ({
    width: '100%',
    height: '42px',
    padding: '0 40px 0 14px',
    borderRadius: '10px',
    background: '#ffffff',
    border: focusedInput === id ? '1.5px solid #00d09c' : '1px solid #cbd5e1',
    color: '#0f172a',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    outline: 'none',
    boxShadow: focusedInput === id ? '0 0 0 3px rgba(0, 208, 156, 0.08)' : 'none',
    transition: 'all 0.15s ease-in-out',
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat'
  });

  return (
    <div>
      {/* ── Modals Overlay ── */}
      {isPlanModalOpen && (
        <div
          onClick={() => setIsPlanModalOpen(false)}
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
              maxWidth: 520,
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.25)',
              border: '1px solid rgba(0,0,0,0.06)',
              animation: 'slideInUp 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,208,156,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={20} style={{ color: '#00d09c' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Configure Benefit Plan</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>Launch a new health or coverage plan corporate directory.</p>
                </div>
              </div>
              <button onClick={() => setIsPlanModalOpen(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePlanSubmit}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Plan Name</label>
                <input className="form-input" style={getInputStyle('planname')} type="text" placeholder="E.g., Gold Premium Health Plan 1" value={newPlanName} onChange={e => setNewPlanName(e.target.value)} onFocus={() => setFocusedInput('planname')} onBlur={() => setFocusedInput(null)} required />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Plan Type</label>
                <select className="form-select" style={getSelectStyle('plantype')} value={newPlanType} onChange={e => setNewPlanType(e.target.value)} onFocus={() => setFocusedInput('plantype')} onBlur={() => setFocusedInput(null)}>
                  <option value="GroupHealthInsurance">Group Health Insurance</option>
                  <option value="LifeCover">Life Cover</option>
                  <option value="DentalVision">Dental & Vision Care</option>
                  <option value="FlexibleBenefit">Flexible Benefit program</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Eligible Grades (comma-separated)</label>
                <input className="form-input" style={getInputStyle('plangrades')} type="text" value={newPlanGrades} placeholder="G1,G2,G3" onChange={e => setNewPlanGrades(e.target.value)} onFocus={() => setFocusedInput('plangrades')} onBlur={() => setFocusedInput(null)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Emp Contribution ($)</label>
                  <input className="form-input" style={getInputStyle('planemp')} type="number" min={0} value={newPlanEmpCont} onChange={e => setNewPlanEmpCont(Number(e.target.value))} onFocus={() => setFocusedInput('planemp')} onBlur={() => setFocusedInput(null)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Employer Contribution ($)</label>
                  <input className="form-input" style={getInputStyle('planempr')} type="number" min={0} value={newPlanEmprCont} onChange={e => setNewPlanEmprCont(Number(e.target.value))} onFocus={() => setFocusedInput('planempr')} onBlur={() => setFocusedInput(null)} required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 28 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Coverage Limit ($)</label>
                <input className="form-input" style={getInputStyle('planlimit')} type="number" min={0} value={newPlanLimit} onChange={e => setNewPlanLimit(Number(e.target.value))} onFocus={() => setFocusedInput('planlimit')} onBlur={() => setFocusedInput(null)} required />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, height: 44, borderRadius: 10, fontWeight: 700, border: '1px solid #cbd5e1', background: '#f8fafc' }} onClick={() => setIsPlanModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 2, height: 44, borderRadius: 10, fontWeight: 700, background: 'linear-gradient(135deg, #00d09c, #00b587)' }}>
                  {isSubmitting ? 'Creating...' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isWindowModalOpen && (
        <div
          onClick={() => setIsWindowModalOpen(false)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,208,156,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} style={{ color: '#00d09c' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Open Enrolment Window</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>Schedule a new active timeline eligibility.</p>
                </div>
              </div>
              <button onClick={() => setIsWindowModalOpen(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWindowSubmit}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Plan Year</label>
                <input className="form-input" style={getInputStyle('winyear')} type="number" value={newWinYear} onChange={e => setNewWinYear(Number(e.target.value))} onFocus={() => setFocusedInput('winyear')} onBlur={() => setFocusedInput(null)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Open Date</label>
                  <input className="form-input" style={getInputStyle('winopen')} type="date" value={newWinOpen} onChange={e => setNewWinOpen(e.target.value)} onFocus={() => setFocusedInput('winopen')} onBlur={() => setFocusedInput(null)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Close Date</label>
                  <input className="form-input" style={getInputStyle('winclose')} type="date" value={newWinClose} onChange={e => setNewWinClose(e.target.value)} onFocus={() => setFocusedInput('winclose')} onBlur={() => setFocusedInput(null)} required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 28 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Eligible Grades</label>
                <input className="form-input" style={getInputStyle('wingrades')} type="text" value={newWinGrades} onChange={e => setNewWinGrades(e.target.value)} onFocus={() => setFocusedInput('wingrades')} onBlur={() => setFocusedInput(null)} required />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, height: 44, borderRadius: 10, fontWeight: 700, border: '1px solid #cbd5e1', background: '#f8fafc' }} onClick={() => setIsWindowModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 2, height: 44, borderRadius: 10, fontWeight: 700, background: 'linear-gradient(135deg, #00d09c, #00b587)' }}>
                  {isSubmitting ? 'Opening...' : 'Open Window'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>HR Benefits Configurator & Enrolments Panel</h3>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeAdminTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveAdminTab('plans')}>Benefit Plans</button>
        <button className={`tab-btn ${activeAdminTab === 'windows' ? 'active' : ''}`} onClick={() => setActiveAdminTab('windows')}>Enrolment Windows</button>
        <button className={`tab-btn ${activeAdminTab === 'enrolments' ? 'active' : ''}`} onClick={() => setActiveAdminTab('enrolments')}>Employee Enrolments</button>
      </div>

      {activeAdminTab === 'plans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #00d09c, #00b587)', boxShadow: '0 4px 12px rgba(0, 208, 156, 0.15)', borderRadius: 10, fontWeight: 700 }} onClick={() => setIsPlanModalOpen(true)}>
              <PlusCircle size={16} /> Configure New Benefit Plan
            </button>
          </div>

          <div className="glass-panel" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)', width: '100%', margin: 0 }}>
            <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 16, color: '#0f172a' }}>Benefits Directory</h4>
            <div className="table-wrapper" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table className="custom-table" style={{ width: '100%', tableLayout: 'auto' }}>
                <thead>
                  <tr>
                    <th style={{ width: '35%' }}>Plan Name</th>
                    <th style={{ width: '25%' }}>Type</th>
                    <th style={{ width: '20%' }}>Eligible Grades</th>
                    <th style={{ width: '20%', textAlign: 'right' }}>Coverage Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>No benefits plans configured yet.</td>
                    </tr>
                  ) : plans.map(p => (
                    <tr key={p.planID}>
                      <td style={{ fontWeight: 700, color: '#1e293b' }}>{p.planName}</td>
                      <td style={{ color: '#475569' }}>
                        <span className="badge badge-info">{p.planType}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#334155' }}>{p.eligibilityGrade}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>${p.coverageLimit.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'windows' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #00d09c, #00b587)', boxShadow: '0 4px 12px rgba(0, 208, 156, 0.15)', borderRadius: 10, fontWeight: 700 }} onClick={() => setIsWindowModalOpen(true)}>
              <PlusCircle size={16} /> Open New Enrolment Window
            </button>
          </div>

          <div className="glass-panel" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)', width: '100%', margin: 0 }}>
            <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 16, color: '#0f172a' }}>Enrolment Windows History</h4>
            <div className="table-wrapper" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table className="custom-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Plan Year</th>
                    <th>Open Date</th>
                    <th>Close Date</th>
                    <th>Grades Scope</th>
                    <th style={{ textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {windows.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>No enrolment windows configured.</td>
                    </tr>
                  ) : windows.map(w => (
                    <tr key={w.windowID}>
                      <td style={{ fontWeight: 700, color: '#1e293b' }}>{w.planYear}</td>
                      <td>{new Date(w.openDate).toLocaleDateString()}</td>
                      <td>{new Date(w.closeDate).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600, color: '#475569' }}>{w.eligibleGrades}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge ${w.status === 'Open' ? 'badge-success' : 'badge-danger'}`}>{w.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'enrolments' && (
        <div className="glass-panel" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)', width: '100%', margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Employee Enrolment Submissions</h4>
            {allEnrolments.filter(e => e.status === 'Submitted').length > 0 && (
              <span className="badge badge-warning" style={{ fontWeight: 700 }}>
                {allEnrolments.filter(e => e.status === 'Submitted').length} pending approval
              </span>
            )}
          </div>
          <div className="table-wrapper" style={{ maxHeight: '480px', overflowY: 'auto' }}>
            <table className="custom-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Enrolment ID</th>
                  <th>Employee ID</th>
                  <th>Plan ID</th>
                  <th>Coverage Option</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {allEnrolments.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>No submissions recorded.</td>
                  </tr>
                ) : allEnrolments.map(e => (
                  <tr key={e.enrolmentID}>
                    <td>#{e.enrolmentID}</td>
                    <td style={{ fontWeight: 700, color: '#1e293b' }}>{e.employeeID}</td>
                    <td style={{ fontWeight: 600, color: '#475569' }}>Plan #{e.planID}</td>
                    <td>{e.coverageOption}</td>
                    <td>
                      <span className={`badge ${e.status === 'Active' ? 'badge-success' : e.status === 'Submitted' ? 'badge-warning' : 'badge-danger'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        {e.status === 'Submitted' ? (
                          <>
                            <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => verifyEnrolment(e.enrolmentID, 'Active')}>
                              <Check size={14} /> Approve
                            </button>
                            <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => verifyEnrolment(e.enrolmentID, 'Cancelled')}>
                              <AlertCircle size={14} /> Reject
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Processed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
