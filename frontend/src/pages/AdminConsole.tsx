import React, { useState } from 'react';
import type { User, AuditLog } from '../types';

interface AdminConsoleProps {
  usersList: User[];
  auditLogs: AuditLog[];
  onToggleUserStatus: (userId: number, newStatus: 'Active' | 'Inactive') => Promise<void>;
  activeAdminViewTab: 'users' | 'audit';
  onAdminViewTabChange: (tab: 'users' | 'audit') => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  usersList,
  auditLogs,
  onToggleUserStatus,
  activeAdminViewTab,
  onAdminViewTabChange
}) => {
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleToggle = async (userId: number, currentStatus: string) => {
    setTogglingId(userId);
    try {
      const targetStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await onToggleUserStatus(userId, targetStatus);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Global Admin Console Settings</h3>
      <p style={{ color: 'hsl(var(--text-muted))', marginBottom: 24 }}>System administration, role auditing, and database tracking.</p>

      <div className="tabs-container">
        <button className={`tab-btn ${activeAdminViewTab === 'users' ? 'active' : ''}`} onClick={() => onAdminViewTabChange('users')}>Users Catalog</button>
        <button className={`tab-btn ${activeAdminViewTab === 'audit' ? 'active' : ''}`} onClick={() => onAdminViewTabChange('audit')}>Audit Trail Logs</button>
      </div>

      {activeAdminViewTab === 'users' ? (
        <div className="glass-panel">
          <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Registered Employee Profiles</h4>
          <div className="table-wrapper" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => (
                  <tr key={u.userID}>
                    <td>{u.userID}</td>
                    <td style={{ fontWeight: 700 }}>{u.employeeID}</td>
                    <td>{u.name}</td>
                    <td>
                      <span className="badge badge-primary">{u.role}</span>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.departmentID}</td>
                    <td>{u.gradeID}</td>
                    <td>
                      <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{u.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className={`btn ${u.status === 'Active' ? 'btn-danger' : 'btn-success'}`}
                        style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: 8, fontWeight: 700, minWidth: 100 }}
                        disabled={togglingId === u.userID}
                        onClick={() => handleToggle(u.userID, u.status)}
                      >
                        {togglingId === u.userID ? 'Saving...' : u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-panel">
          <h4 style={{ fontWeight: 700, marginBottom: 16 }}>System Action Audits (Identity AuditLogs)</h4>
          <div className="table-wrapper" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>User ID</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(l => (
                  <tr key={l.auditID}>
                    <td>#{l.auditID}</td>
                    <td>{l.userID}</td>
                    <td style={{ fontWeight: 600 }}>{l.action}</td>
                    <td>{l.module}</td>
                    <td>{new Date(l.timestamp).toLocaleString()}</td>
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
