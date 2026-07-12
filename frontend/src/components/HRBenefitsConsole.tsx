import React, { useState } from 'react';
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

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPlan({
      planName: newPlanName,
      planType: newPlanType,
      eligibilityGrade: newPlanGrades,
      employeeContribution: newPlanEmpCont,
      employerContribution: newPlanEmprCont,
      coverageLimit: newPlanLimit,
      effectiveDate: new Date().toISOString().split('T')[0],
      status: "Active"
    }).then(() => {
      setNewPlanName('');
    });
  };

  const handleWindowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWindow({
      planYear: newWinYear,
      openDate: newWinOpen,
      closeDate: newWinClose,
      eligibleGrades: newWinGrades,
      status: "Open"
    }).then(() => {
      setNewWinOpen('');
      setNewWinClose('');
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>HR Benefits Configurator & Enrolments Panel</h3>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeAdminTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveAdminTab('plans')}>Benefit Plans</button>
        <button className={`tab-btn ${activeAdminTab === 'windows' ? 'active' : ''}`} onClick={() => setActiveAdminTab('windows')}>Enrolment Windows</button>
        <button className={`tab-btn ${activeAdminTab === 'enrolments' ? 'active' : ''}`} onClick={() => setActiveAdminTab('enrolments')}>Employee Enrolments</button>
      </div>

      {activeAdminTab === 'plans' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 30 }}>
          <div className="glass-panel">
            <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Configure New Benefit Plan</h4>
            <form onSubmit={handlePlanSubmit}>
              <div className="form-group">
                <label className="form-label">Plan Name</label>
                <input className="form-input" type="text" value={newPlanName} onChange={e => setNewPlanName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Plan Type</label>
                <select className="form-select" value={newPlanType} onChange={e => setNewPlanType(e.target.value)}>
                  <option value="GroupHealthInsurance">Group Health Insurance</option>
                  <option value="LifeCover">Life Cover</option>
                  <option value="DentalVision">Dental & Vision Care</option>
                  <option value="FlexibleBenefit">Flexible Benefit program</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Eligible Grades (comma-separated)</label>
                <input className="form-input" type="text" value={newPlanGrades} placeholder="G1,G2,G3" onChange={e => setNewPlanGrades(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Emp Contribution ($)</label>
                  <input className="form-input" type="number" min={0} value={newPlanEmpCont} onChange={e => setNewPlanEmpCont(Number(e.target.value))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Employer Contribution ($)</label>
                  <input className="form-input" type="number" min={0} value={newPlanEmprCont} onChange={e => setNewPlanEmprCont(Number(e.target.value))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Coverage Limit ($)</label>
                <input className="form-input" type="number" min={0} value={newPlanLimit} onChange={e => setNewPlanLimit(Number(e.target.value))} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Plan</button>
            </form>
          </div>

          <div className="glass-panel">
            <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Benefits Directory</h4>
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>Type</th>
                    <th>Grades</th>
                    <th>Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(p => (
                    <tr key={p.planID}>
                      <td style={{ fontWeight: 600 }}>{p.planName}</td>
                      <td>{p.planType}</td>
                      <td>{p.eligibilityGrade}</td>
                      <td>${p.coverageLimit.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'windows' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 30 }}>
          <div className="glass-panel">
            <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Open New Enrolment Window</h4>
            <form onSubmit={handleWindowSubmit}>
              <div className="form-group">
                <label className="form-label">Plan Year</label>
                <input className="form-input" type="number" value={newWinYear} onChange={e => setNewWinYear(Number(e.target.value))} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Open Date</label>
                  <input className="form-input" type="date" value={newWinOpen} onChange={e => setNewWinOpen(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Close Date</label>
                  <input className="form-input" type="date" value={newWinClose} onChange={e => setNewWinClose(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Eligible Grades</label>
                <input className="form-input" type="text" value={newWinGrades} onChange={e => setNewWinGrades(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Open Window</button>
            </form>
          </div>

          <div className="glass-panel">
            <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Enrolment Windows History</h4>
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Open Date</th>
                    <th>Close Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {windows.map(w => (
                    <tr key={w.windowID}>
                      <td>{w.planYear}</td>
                      <td>{new Date(w.openDate).toLocaleDateString()}</td>
                      <td>{new Date(w.closeDate).toLocaleDateString()}</td>
                      <td>
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
        <div className="glass-panel">
          <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Employee Enrolment Submissions</h4>
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Enrolment ID</th>
                  <th>Employee ID</th>
                  <th>Plan ID</th>
                  <th>Coverage Option</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allEnrolments.map(e => (
                  <tr key={e.enrolmentID}>
                    <td>{e.enrolmentID}</td>
                    <td>{e.employeeID}</td>
                    <td>Plan #{e.planID}</td>
                    <td>{e.coverageOption}</td>
                    <td>
                      <span className={`badge ${e.status === 'Active' ? 'badge-success' : e.status === 'Submitted' ? 'badge-warning' : 'badge-danger'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td>
                      {e.status === 'Submitted' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => verifyEnrolment(e.enrolmentID, 'Active')}>
                            Approve
                          </button>
                          <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => verifyEnrolment(e.enrolmentID, 'Cancelled')}>
                            Reject
                          </button>
                        </div>
                      )}
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
