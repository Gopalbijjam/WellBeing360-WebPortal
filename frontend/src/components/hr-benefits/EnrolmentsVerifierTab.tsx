import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import type { BenefitEnrolment } from '../../types';

interface EnrolmentsVerifierTabProps {
  allEnrolments: BenefitEnrolment[];
  verifyEnrolment: (id: number, status: string) => Promise<void>;
}

export const EnrolmentsVerifierTab: React.FC<EnrolmentsVerifierTabProps> = ({
  allEnrolments,
  verifyEnrolment
}) => {
  return (
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
  );
};
