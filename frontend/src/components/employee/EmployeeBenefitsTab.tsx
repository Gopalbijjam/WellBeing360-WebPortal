import React, { useState } from 'react';
import { Trash2, X, ShieldAlert } from 'lucide-react';
import type { BenefitPlan, EnrolmentWindow, BenefitEnrolment } from '../../types';

interface EmployeeBenefitsTabProps {
  plans: BenefitPlan[];
  windows: EnrolmentWindow[];
  myEnrolments: BenefitEnrolment[];
  submitEnrolment: (planID: number, coverage: string, includeDeps: boolean, deps: any[]) => Promise<void>;
}

export const EmployeeBenefitsTab: React.FC<EmployeeBenefitsTabProps> = ({
  plans,
  windows,
  myEnrolments,
  submitEnrolment
}) => {
  const [enrolPlanID, setEnrolPlanID] = useState<number>(plans[0]?.planID || 1);
  const [enrolCoverage, setEnrolCoverage] = useState<string>('Individual');
  const [includeDeps, setIncludeDeps] = useState<boolean>(false);
  const [depsInput, setDepsInput] = useState<any[]>([{ name: '', relationship: 'Spouse', dob: '' }]);
  const [isEnrolModalOpen, setIsEnrolModalOpen] = useState<boolean>(false);

  const handleAddEnrolDep = () => {
    setDepsInput([...depsInput, { name: '', relationship: 'Spouse', dob: '' }]);
  };

  const handleRemoveEnrolDep = (index: number) => {
    setDepsInput(depsInput.filter((_, i) => i !== index));
  };

  const handleEnrolFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitEnrolment(enrolPlanID, enrolCoverage, includeDeps, depsInput);
    setIsEnrolModalOpen(false);
  };

  const getSelectStyle = () => ({
    width: '100%',
    height: '46px',
    padding: '0 40px 0 14px',
    borderRadius: '12px',
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    color: '#0f172a',
    fontFamily: 'inherit',
    fontSize: '0.92rem',
    outline: 'none',
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 14px center',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat',
    transition: 'all 0.15s ease-in-out'
  });

  return (
    <>
      {/* Enrolment Modal Popup */}
      {isEnrolModalOpen && (
        <div
          onClick={() => setIsEnrolModalOpen(false)}
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
              maxWidth: 540,
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.25)',
              border: '1px solid rgba(0,0,0,0.06)',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideInUp 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Benefits Enrolment Wizard</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>Configure healthcare & flex plans options.</p>
              </div>
              <button onClick={() => setIsEnrolModalOpen(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEnrolFormSubmit}>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Select Benefit Plan</label>
                <select className="form-select" style={getSelectStyle()} value={enrolPlanID} onChange={e => setEnrolPlanID(Number(e.target.value))}>
                  {plans.filter(p => p.status === 'Active').map(p => (
                    <option key={p.planID} value={p.planID}>{p.planName} (${p.employeeContribution}/mo)</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>Coverage Option</label>
                <select className="form-select" style={getSelectStyle()} value={enrolCoverage} onChange={e => setEnrolCoverage(e.target.value)}>
                  <option value="Individual">Individual (Self Only)</option>
                  <option value="SpouseOnly">Spouse Only</option>
                  <option value="Family">Family Coverage</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={includeDeps} onChange={e => setIncludeDeps(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#6366f1' }} />
                  Include Dependents
                </label>
              </div>

              {includeDeps && (
                <div style={{ marginBottom: 24, padding: 18, border: '1px solid #e2e8f0', borderRadius: 14, background: '#f8fafc' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Dependents Details
                    <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, fontWeight: 700 }} onClick={handleAddEnrolDep}>
                      + Add Row
                    </button>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {depsInput.map((dep, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                        <div style={{ flex: 2 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Name</label>
                          <input className="form-input" style={{ height: 38, borderRadius: 8, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '0.88rem' }} type="text" value={dep.name} placeholder="Full Name" onChange={e => {
                            const list = [...depsInput];
                            list[idx].name = e.target.value;
                            setDepsInput(list);
                          }} required />
                        </div>
                        <div style={{ flex: 1.5 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Relation</label>
                          <select className="form-select" style={{ height: 38, borderRadius: 8, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '0.85rem' }} value={dep.relationship} onChange={e => {
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
                          <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>DOB</label>
                          <input className="form-input" style={{ height: 38, borderRadius: 8, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '0.85rem' }} type="date" value={dep.dob} onChange={e => {
                            const list = [...depsInput];
                            list[idx].dob = e.target.value;
                            setDepsInput(list);
                          }} required />
                        </div>
                        {depsInput.length > 1 && (
                          <button type="button" className="btn btn-danger" style={{ padding: '10px', borderRadius: 8, display: 'flex', alignItems: 'center' }} onClick={() => handleRemoveEnrolDep(idx)}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, height: 44, borderRadius: 10, fontWeight: 700, border: '1px solid #cbd5e1', background: '#f8fafc' }} onClick={() => setIsEnrolModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, height: 44, borderRadius: 10, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                  Submit Enrolment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '520px', overflowY: 'auto', paddingRight: '6px' }}>
            {plans.filter(p => p.status === 'Active').map(p => (
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

        {/* Enrolment Wizard Status */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Benefits Enrolment Status</h3>
          {myEnrolments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {myEnrolments.map(enrol => {
                const plan = plans.find(p => p.planID === enrol.planID);
                return (
                  <div key={enrol.enrolmentID} style={{ padding: 20, border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 12, background: 'rgba(16, 185, 129, 0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h4 style={{ fontWeight: 800, color: '#1e293b' }}>{plan?.planName || `Plan #${enrol.planID}`}</h4>
                      <span className={`badge ${enrol.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{enrol.status}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem', color: '#475569' }}>
                      <div><strong>Coverage Option:</strong> {enrol.coverageOption}</div>
                      <div><strong>Your Cost:</strong> ${enrol.employeeContributionAmount}/mo</div>
                      <div><strong>Enrolled Date:</strong> {new Date(enrol.effectiveDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                );
              })}
              {windows.some(w => w.status === 'Open') && (
                <button className="btn btn-primary" style={{ marginTop: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }} onClick={() => setIsEnrolModalOpen(true)}>
                  Modify Coverage Option
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.06)', border: '1.5px solid rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <ShieldAlert size={28} style={{ color: '#ef4444' }} />
              </div>
              <h4 style={{ fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Not Enrolled</h4>
              <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: 280, margin: '0 auto 24px' }}>
                You are not currently enrolled in any flexible benefits or health insurance coverages for the current period.
              </p>
              {(() => {
                const openWindow = windows.some(w => w.status === 'Open');
                return openWindow ? (
                  <button className="btn btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }} onClick={() => setIsEnrolModalOpen(true)}>
                    Start Enrolment Wizard
                  </button>
                ) : (
                  <button className="btn btn-secondary" style={{ width: '100%', cursor: 'not-allowed' }} disabled>
                    Enrolment Period Closed
                  </button>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
