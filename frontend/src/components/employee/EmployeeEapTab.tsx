import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import type { EAPService, EAPSession } from '../../types';

interface EmployeeEapTabProps {
  eapServices: EAPService[];
  mySessions: EAPSession[];
  bookEapSession: (serviceID: number, date: string) => Promise<void>;
}

export const EmployeeEapTab: React.FC<EmployeeEapTabProps> = ({
  eapServices,
  mySessions,
  bookEapSession
}) => {
  const [eapServiceID, setEapServiceID] = useState<number>(eapServices[0]?.serviceID || 1);
  const [eapDate, setEapDate] = useState('');

  const handleEapBookFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookEapSession(eapServiceID, eapDate);
    setEapDate('');
  };

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
        <div className="table-wrapper" style={{ maxHeight: '360px', overflowY: 'auto' }}>
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
                    <span className={`badge ${s.status === 'Scheduled' ? 'badge-info' : s.status === 'Completed' ? 'badge-success' : s.status === 'Requested' ? 'badge-warning' : s.status === 'Requested' ? 'badge-warning' : 'badge-danger'}`}>
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
};
