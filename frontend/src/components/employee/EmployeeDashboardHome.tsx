import React from 'react';
import { Heart, Activity, Calendar, Award, Star, Plus } from 'lucide-react';
import type { User, RewardPoints, BenefitEnrolment, ActivityLog, EAPSession } from '../../types';

interface EmployeeDashboardHomeProps {
  user: User;
  points: RewardPoints | null;
  myEnrolments: BenefitEnrolment[];
  myLogs: ActivityLog[];
  mySessions: EAPSession[];
  setActiveTab: (tab: string) => void;
}

export const EmployeeDashboardHome: React.FC<EmployeeDashboardHomeProps> = ({
  user,
  points,
  myEnrolments,
  myLogs,
  mySessions,
  setActiveTab
}) => {
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
            <div className="table-wrapper" style={{ maxHeight: '320px', overflowY: 'auto' }}>
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
};
