import React from 'react';
import { 
  Users, Database, Shield, Calendar, ShieldCheck, 
  Activity, Star, Award, Gift, BarChart, Check, X, 
  AlertTriangle, Eye, ArrowRight, UserCheck, Settings
} from 'lucide-react';
import type { 
  User, AuditLog, BenefitEnrolment, BenefitPlan, EnrolmentWindow, 
  ActivityLog, WellnessChallenge, WellnessProgram, RedemptionCatalog, 
  RecognitionAward, BenefitsReport 
} from '../types';

interface AdminHomeDashboardProps {
  user: User;
  setActiveTab: (tab: string) => void;
  usersList: User[];
  auditLogs: AuditLog[];
  allEnrolments: BenefitEnrolment[];
  plans: BenefitPlan[];
  windows: EnrolmentWindow[];
  pendingLogs: ActivityLog[];
  challenges: WellnessChallenge[];
  programs: WellnessProgram[];
  catalog: RedemptionCatalog[];
  awards: RecognitionAward[];
  reportsHistory: BenefitsReport[];
  handleVerifyLog?: (id: number, approve: boolean) => Promise<void>;
  handleVerifyEnrolment?: (id: number, status: string) => Promise<void>;
}

export const AdminHomeDashboard: React.FC<AdminHomeDashboardProps> = ({
  user,
  setActiveTab,
  usersList,
  auditLogs,
  allEnrolments,
  plans,
  windows,
  pendingLogs,
  challenges,
  programs,
  catalog,
  awards,
  reportsHistory,
  handleVerifyLog,
  handleVerifyEnrolment
}) => {

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'Admin':
        return renderAdminDashboard();
      case 'HRBenefitsAdmin':
        return renderHRBenefitsDashboard();
      case 'WellnessCoordinator':
        return renderWellnessCoordinatorDashboard();
      case 'RecognitionManager':
        return renderRecognitionManagerDashboard();
      case 'Finance':
        return renderFinanceDashboard();
      default:
        return (
          <div className="glass-panel" style={{ textAlign: 'center', padding: 40 }}>
            <h3 style={{ fontWeight: 800 }}>Role Not Recognized</h3>
            <p style={{ color: 'hsl(var(--text-muted))' }}>Please contact support if you believe this is an error.</p>
          </div>
        );
    }
  };

  // 1. GLOBAL SYSTEM ADMIN DASHBOARD
  const renderAdminDashboard = () => {
    const activeUsers = usersList.filter(u => u.status === 'Active').length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {/* Role Intro Card */}
        <div className="glass-panel" style={{ background: 'linear-gradient(135deg, hsla(var(--primary)/0.08), transparent)', borderLeft: '4px solid hsl(var(--primary))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Shield size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-main))' }}>Logged in as System Administrator</h3>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', marginTop: 4 }}>
                You have global root access to audit logging database, active security tracking, and employee profile directories.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>Registered Users</h3>
              <p>{usersList.length} Accounts</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">
              <UserCheck size={24} />
            </div>
            <div className="stat-info">
              <h3>Active Personnel</h3>
              <p>{activeUsers} Active</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon secondary">
              <Database size={24} />
            </div>
            <div className="stat-info">
              <h3>Security Audits</h3>
              <p>{auditLogs.length} Events Logged</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel">
          <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Admin Shortcuts</h4>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('users')}>
              <Users size={16} /> Manage User Directory
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('audit')}>
              <Database size={16} /> Inspect Audit Trails
            </button>
          </div>
        </div>

        {/* Audit widget */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ fontWeight: 800 }}>Recent System Audits</h4>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setActiveTab('audit')}>
              View All Logs <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-wrapper" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Actor ID</th>
                  <th>Performed Action</th>
                  <th>Target Module</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 5).map(log => (
                  <tr key={log.auditID}>
                    <td>#{log.auditID}</td>
                    <td style={{ fontWeight: 600 }}>{log.userID}</td>
                    <td style={{ fontWeight: 600, color: 'hsl(var(--primary))' }}>{log.action}</td>
                    <td>{log.module}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 2. HR BENEFITS ADMINISTRATOR DASHBOARD
  const renderHRBenefitsDashboard = () => {
    const pendingEnrolments = allEnrolments.filter(e => e.status === 'Submitted' || e.status === 'Pending');
    const openWindow = windows.find(w => w.status === 'Open');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {/* Role Intro Card */}
        <div className="glass-panel" style={{ background: 'linear-gradient(135deg, hsla(var(--primary)/0.08), transparent)', borderLeft: '4px solid hsl(var(--primary))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-main))' }}>Logged in as HR Benefits Administrator</h3>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', marginTop: 4 }}>
                Manage corporate insurance policies, configure flex benefit buckets, verify pending employee enrollments, and coordinate counseling sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <h3>Pending Approvals</h3>
              <p>{pendingEnrolments.length} Enrolments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <h3>Active Benefit Plans</h3>
              <p>{plans.filter(p => p.status === 'Active').length} Active</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon secondary">
              <Eye size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Enrolments</h3>
              <p>{allEnrolments.length} Records</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel">
          <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Benefits Shortcuts</h4>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('benefits')}>
              <Settings size={16} /> Open Plans & Enrolment Configuration
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('eap')}>
              <Calendar size={16} /> Manage Employee EAP Sessions
            </button>
          </div>
        </div>

        {/* Enrolment Window Widget */}
        <div className="glass-panel">
          <h4 style={{ fontWeight: 800, marginBottom: 12 }}>Current Enrolment Window Status</h4>
          {openWindow ? (
            <div style={{ padding: '16px 20px', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 12, background: 'rgba(16, 185, 129, 0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#10b981', fontSize: '1rem' }}>Active Window Opened (Plan Year {openWindow.planYear})</strong>
                  <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginTop: 4 }}>
                    Open from {new Date(openWindow.openDate).toLocaleDateString()} to {new Date(openWindow.closeDate).toLocaleDateString()} · Eligible Grades: {openWindow.eligibleGrades}
                  </p>
                </div>
                <span className="badge badge-success">Open</span>
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px 20px', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, background: 'rgba(239, 68, 68, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#ef4444', fontSize: '1rem' }}>No Active Enrolment Window Open</strong>
                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginTop: 4 }}>
                  Employees are unable to enroll in flex benefits or modify active configurations at this time.
                </p>
              </div>
              <span className="badge badge-danger">Closed</span>
            </div>
          )}
        </div>

        {/* Pending Enrolment Approvals Actions directly on homepage */}
        <div className="glass-panel">
          <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Pending Enrolment Approvals</h4>
          {pendingEnrolments.length === 0 ? (
            <p style={{ color: 'hsl(var(--text-muted))' }}>No enrolments pending review. Good job!</p>
          ) : (
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Plan Name</th>
                    <th>Coverage Option</th>
                    <th>Cost</th>
                    <th>Date Submitted</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEnrolments.slice(0, 5).map(enrol => {
                    const planName = plans.find(p => p.planID === enrol.planID)?.planName || `Plan #${enrol.planID}`;
                    return (
                      <tr key={enrol.enrolmentID}>
                        <td style={{ fontWeight: 700 }}>{enrol.employeeID}</td>
                        <td>{planName}</td>
                        <td>{enrol.coverageOption}</td>
                        <td>${enrol.employeeContributionAmount}/mo</td>
                        <td>{new Date(enrol.effectiveDate).toLocaleDateString()}</td>
                        <td style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button 
                            className="btn btn-success" 
                            style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                            onClick={() => handleVerifyEnrolment && handleVerifyEnrolment(enrol.enrolmentID, 'Active')}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                            onClick={() => handleVerifyEnrolment && handleVerifyEnrolment(enrol.enrolmentID, 'Cancelled')}
                          >
                            <X size={14} /> Reject
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 3. WELLNESS PROGRAM COORDINATOR DASHBOARD
  const renderWellnessCoordinatorDashboard = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {/* Role Intro Card */}
        <div className="glass-panel" style={{ background: 'linear-gradient(135deg, hsla(var(--primary)/0.08), transparent)', borderLeft: '4px solid hsl(var(--primary))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Activity size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-main))' }}>Logged in as Wellness Program Coordinator</h3>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', marginTop: 4 }}>
                Design active wellness programs and challenges (steps, meditation), audit employee submissions, and allocate reward points.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <h3>Pending Verification</h3>
              <p>{pendingLogs.length} Wellness Logs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">
              <Activity size={24} />
            </div>
            <div className="stat-info">
              <h3>Active Challenges</h3>
              <p>{challenges.filter(c => c.status === 'Active').length} Active</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon secondary">
              <Star size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Programs</h3>
              <p>{programs.length} Programs</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel">
          <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Wellness Shortcuts</h4>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('wellness')}>
              <Activity size={16} /> Open Wellness Coordinator Console
            </button>
          </div>
        </div>

        {/* Actions directly on Homepage */}
        <div className="glass-panel">
          <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Pending Activity Logs Verification</h4>
          {pendingLogs.length === 0 ? (
            <p style={{ color: 'hsl(var(--text-muted))' }}>No pending activity logs. Good job!</p>
          ) : (
            <div className="table-wrapper" style={{ maxHeight: 320, overflowY: 'auto' }}>
              <table className="custom-table">
                <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: 'var(--glass-bg)' }}>
                  <tr>
                    <th>Emp ID</th>
                    <th>Challenge ID</th>
                    <th>Logged Value</th>
                    <th>Submission Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLogs.map(log => (
                    <tr key={log.logID}>
                      <td style={{ fontWeight: 700 }}>{log.employeeID}</td>
                      <td>Challenge #{log.challengeID}</td>
                      <td style={{ fontWeight: 600 }}>{log.activityValue}</td>
                      <td>{new Date(log.logDate).toLocaleDateString()}</td>
                      <td style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-success" 
                          style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                          onClick={() => handleVerifyLog && handleVerifyLog(log.logID, true)}
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                          onClick={() => handleVerifyLog && handleVerifyLog(log.logID, false)}
                        >
                          <X size={14} /> Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 4. RECOGNITION MANAGER DASHBOARD
  const renderRecognitionManagerDashboard = () => {
    const lowStockItems = catalog.filter(item => item.availableQuantity < 5);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {/* Role Intro Card */}
        <div className="glass-panel" style={{ background: 'linear-gradient(135deg, hsla(var(--primary)/0.08), transparent)', borderLeft: '4px solid hsl(var(--primary))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Award size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-main))' }}>Logged in as Recognition & Rewards Manager</h3>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', marginTop: 4 }}>
                Configure the rewards catalog inventory (gift cards, experience passes), track available stock levels, and audit peer-to-peer nomination distributions.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Gift size={24} />
            </div>
            <div className="stat-info">
              <h3>Catalog Items</h3>
              <p>{catalog.length} Items</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">
              <Award size={24} />
            </div>
            <div className="stat-info">
              <h3>Awards Distributed</h3>
              <p>{awards.length} Nominations</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon secondary">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <h3>Low Stock Alert</h3>
              <p>{lowStockItems.length} Items (&lt; 5)</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel">
          <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Recognition Shortcuts</h4>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('rewards')}>
              <Gift size={16} /> Manage Redemption Catalog Items
            </button>
          </div>
        </div>

        {/* Low Stock Warning Panel */}
        {lowStockItems.length > 0 && (
          <div className="glass-panel" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.02)' }}>
            <h4 style={{ fontWeight: 800, color: '#d97706', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} /> Low Inventory Catalog Alert
            </h4>
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Points Required</th>
                    <th>Stock Left</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map(item => (
                    <tr key={item.itemID}>
                      <td style={{ fontWeight: 700 }}>{item.itemName}</td>
                      <td>{item.category}</td>
                      <td style={{ fontWeight: 700, color: '#fbbf24' }}>{item.pointsRequired} pts</td>
                      <td style={{ fontWeight: 700, color: '#ef4444' }}>{item.availableQuantity} left</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Peer Nominations list */}
        <div className="glass-panel">
          <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Recent Employee Nominations</h4>
          {awards.length === 0 ? (
            <p style={{ color: 'hsl(var(--text-muted))' }}>No peer nominations logged yet.</p>
          ) : (
            <div className="table-wrapper" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Badge</th>
                    <th>Category</th>
                    <th>Reason</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.map(award => (
                    <tr key={award.awardID}>
                      <td>{award.nominatorID}</td>
                      <td style={{ fontWeight: 700 }}>{award.recipientID}</td>
                      <td>{award.badgeName}</td>
                      <td>{award.category}</td>
                      <td style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>"{award.message}"</td>
                      <td style={{ color: '#fbbf24', fontWeight: 800 }}>+{award.pointsAwarded} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 5. FINANCE DASHBOARD
  const renderFinanceDashboard = () => {
    const latestReport = reportsHistory[0];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {/* Role Intro Card */}
        <div className="glass-panel" style={{ background: 'linear-gradient(135deg, hsla(var(--primary)/0.08), transparent)', borderLeft: '4px solid hsl(var(--primary))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <BarChart size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-main))' }}>Logged in as Finance utilization analyst</h3>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', marginTop: 4 }}>
                Audit claims ratios, generate dynamic financial utilization summaries, monitor wellbeing premium budgets, and track cost history.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <BarChart size={24} />
            </div>
            <div className="stat-info">
              <h3>Saved Reports</h3>
              <p>{reportsHistory.length} Reports</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">
              <Gift size={24} />
            </div>
            <div className="stat-info">
              <h3>Latest Cost</h3>
              <p>{latestReport ? `$${latestReport.metrics.PremiumCost.toLocaleString()}` : 'N/A'}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon secondary">
              <Star size={24} />
            </div>
            <div className="stat-info">
              <h3>Enrolment Rate</h3>
              <p>{latestReport ? `${latestReport.metrics.EnrolmentRate}%` : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel">
          <h4 style={{ fontWeight: 800, marginBottom: 16 }}>Finance Shortcuts</h4>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('reports')}>
              <BarChart size={16} /> Open Premium Reports Center
            </button>
          </div>
        </div>

        {/* Financial reports details summary */}
        {latestReport && (
          <div className="glass-panel">
            <h4 style={{ fontWeight: 800, marginBottom: 12 }}>Latest Report Metrics Summary ({latestReport.scope})</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              <div style={{ padding: 16, border: '1px solid var(--glass-border)', borderRadius: 10 }}>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Claims Submitted</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-main))', marginTop: 4 }}>
                  {latestReport.metrics.ClaimsSubmitted} claims
                </div>
              </div>
              <div style={{ padding: 16, border: '1px solid var(--glass-border)', borderRadius: 10 }}>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Wellness Participation</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-main))', marginTop: 4 }}>
                  {latestReport.metrics.WellnessParticipation} users
                </div>
              </div>
              <div style={{ padding: 16, border: '1px solid var(--glass-border)', borderRadius: 10 }}>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>EAP Sessions Utilized</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-main))', marginTop: 4 }}>
                  {latestReport.metrics.EAPUtilisation} sessions
                </div>
              </div>
              <div style={{ padding: 16, border: '1px solid var(--glass-border)', borderRadius: 10 }}>
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Points Redeemed</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-main))', marginTop: 4 }}>
                  {latestReport.metrics.PointsRedeemed} pts
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Welcome, {user.name} 👋</h2>
      <p style={{ color: 'hsl(var(--text-muted))', marginBottom: 24 }}>System Management Home Hub</p>
      {renderDashboardContent()}
    </div>
  );
};
