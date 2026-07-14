import React from 'react';
import { ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import type { ActivityLog } from '../../types';

interface WellnessLogsVerifierProps {
  pendingLogs: ActivityLog[];
  verifyLog: (id: number, approve: boolean) => Promise<void>;
}

export const WellnessLogsVerifier: React.FC<WellnessLogsVerifierProps> = ({
  pendingLogs,
  verifyLog
}) => {
  return (
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
  );
};
