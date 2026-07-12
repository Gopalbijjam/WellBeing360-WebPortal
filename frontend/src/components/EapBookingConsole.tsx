import React, { useState } from 'react';
import type { EAPSession } from '../types';

interface EapBookingConsoleProps {
  allSessions: EAPSession[];
  updateSessionStatus: (id: number, status: string, counsellor: string) => Promise<void>;
}

export const EapBookingConsole: React.FC<EapBookingConsoleProps> = ({
  allSessions,
  updateSessionStatus
}) => {
  const [assignCounsellor, setAssignCounsellor] = useState<Record<number, string>>({});

  const handleUpdateStatus = (id: number, status: string) => {
    const counsellor = assignCounsellor[id] || "Dr. Counsellor";
    updateSessionStatus(id, status, counsellor);
  };

  return (
    <div className="glass-panel">
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Confidential EAP Booking Management</h3>
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Employee (Anonymised)</th>
              <th>Requested Date</th>
              <th>Session Date</th>
              <th>Counsellor Assign</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allSessions.map(s => (
              <tr key={s.sessionID}>
                <td>{s.sessionID}</td>
                <td style={{ fontStyle: 'italic', color: 'hsl(var(--text-muted))' }}>
                  Anonymized (Ref: {s.employeeID.substring(0, 5)}***)
                </td>
                <td>{new Date(s.requestedDate).toLocaleDateString()}</td>
                <td>{new Date(s.sessionDate).toLocaleString()}</td>
                <td>
                  <input 
                    className="form-input" 
                    style={{ padding: '6px 10px', fontSize: '0.85rem', width: 150 }} 
                    type="text" 
                    placeholder="Dr. Counsellor" 
                    value={assignCounsellor[s.sessionID] || ''} 
                    onChange={e => {
                      setAssignCounsellor({ ...assignCounsellor, [s.sessionID]: e.target.value });
                    }} 
                  />
                </td>
                <td>
                  <span className={`badge ${s.status === 'Scheduled' ? 'badge-info' : s.status === 'Completed' ? 'badge-success' : s.status === 'Requested' ? 'badge-warning' : 'badge-danger'}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  {s.status === 'Requested' && (
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleUpdateStatus(s.sessionID, 'Scheduled')}>
                      Schedule
                    </button>
                  )}
                  {s.status === 'Scheduled' && (
                    <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleUpdateStatus(s.sessionID, 'Completed')}>
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
