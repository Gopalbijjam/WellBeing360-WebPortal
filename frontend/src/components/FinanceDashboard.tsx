import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Calendar, 
  Users, 
  Award, 
  HeartHandshake, 
  Coins, 
  Printer, 
  FileSpreadsheet, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Info,
  Gift,
  CheckCircle
} from 'lucide-react';
import type { BenefitsReport, BenefitPlan, RedemptionCatalog } from '../types';

interface FinanceDashboardProps {
  reportsHistory: BenefitsReport[];
  generateReport: (scope: string) => Promise<void>;
  plans: BenefitPlan[];
  catalog: RedemptionCatalog[];
  approvePlan: (id: number) => Promise<void>;
  rejectPlan: (id: number) => Promise<void>;
  approveCatalogItem: (id: number) => Promise<void>;
  rejectCatalogItem: (id: number) => Promise<void>;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  reportsHistory,
  generateReport,
  plans,
  catalog,
  approvePlan,
  rejectPlan,
  approveCatalogItem,
  rejectCatalogItem
}) => {
  const [reportScope, setReportScope] = useState('Global');
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [prevLatestId, setPrevLatestId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDashboardTab, setActiveDashboardTab] = useState<'analytics' | 'approvals'>('analytics');

  // Sync selected report when a new report is generated
  useEffect(() => {
    if (reportsHistory.length > 0) {
      const latestId = reportsHistory[0].reportID;
      if (prevLatestId === null || latestId !== prevLatestId) {
        setSelectedReportId(latestId);
        setPrevLatestId(latestId);
      }
    }
  }, [reportsHistory, prevLatestId]);

  // Set default selected report if none selected
  useEffect(() => {
    if (reportsHistory.length > 0 && selectedReportId === null) {
      setSelectedReportId(reportsHistory[0].reportID);
    }
  }, [reportsHistory, selectedReportId]);

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await generateReport(reportScope);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeReport = reportsHistory.find(r => r.reportID === selectedReportId) || reportsHistory[0];

  // Get index of active report in history to compute trend against the prior report
  const activeIndex = reportsHistory.findIndex(r => r.reportID === (activeReport?.reportID));
  const priorReport = activeIndex !== -1 && activeIndex + 1 < reportsHistory.length 
    ? reportsHistory[activeIndex + 1] 
    : null;

  // Helper to compute percentage or absolute trend
  const calculateTrend = (current: number, prior: number | undefined, isPercentage: boolean = false) => {
    if (prior === undefined || prior === 0) return null;
    const diff = current - prior;
    const percentChange = (diff / prior) * 100;
    
    // For enrollment rate (percentage already), show absolute difference in points.
    // For others, show percentage change.
    const formatted = isPercentage 
      ? `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`
      : `${diff >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
      
    return {
      diff,
      percentChange,
      formatted,
      isPositive: diff >= 0
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCSVExport = () => {
    if (!activeReport) return;
    setIsExporting(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const headers = ["Metric", "Value", "Scope", "ReportID", "GeneratedDate"];
      const rows = [
        ["Enrolment Rate", `${activeReport.metrics.EnrolmentRate}%`],
        ["Premium Cost", `$${activeReport.metrics.PremiumCost}`],
        ["Claims Submitted", activeReport.metrics.ClaimsSubmitted],
        ["Wellness Participation", activeReport.metrics.WellnessParticipation],
        ["EAP Sessions Utilized", activeReport.metrics.EAPUtilisation],
        ["Peer Recognition Count", activeReport.metrics.RecognitionCount],
        ["Points Redeemed", activeReport.metrics.PointsRedeemed]
      ];
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + [
            headers.join(","),
            ...rows.map(row => [
              `"${row[0]}"`, 
              `"${row[1]}"`, 
              `"${activeReport.scope}"`, 
              `"${activeReport.reportID}"`, 
              `"${new Date(activeReport.generatedDate).toLocaleString()}"`
            ].join(","))
          ].join("\n");
          
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `WellBeing360_Report_${activeReport.scope}_ID${activeReport.reportID}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 1000);
  };

  const pendingPlans = plans.filter(p => p.status === 'PendingApproval');
  const pendingCatalog = catalog.filter(item => item.status === 'PendingApproval');
  const pendingCount = pendingPlans.length + pendingCatalog.length;

  return (
    <div>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #fff !important;
            color: #000 !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
        
        .metric-card-custom {
          background: hsl(var(--bg-card));
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .metric-card-custom:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px var(--glass-shadow);
          border-color: hsla(var(--primary) / 0.3);
        }
        
        .history-row-active {
          background: hsla(var(--primary) / 0.08) !important;
          border-left: 4px solid hsl(var(--primary)) !important;
          font-weight: 600;
        }
        
        .history-row-clickable {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .history-row-clickable:hover {
          background: rgba(0,0,0,0.02) !important;
        }
        
        .dashboard-split-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 30px;
          align-items: start;
        }
        
        .kpi-summary-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 24px;
          margin-bottom: 30px;
        }
        
        .indicators-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .approvals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }

        @media (max-width: 1200px) {
          .dashboard-split-layout {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .kpi-summary-grid {
            grid-template-columns: 1fr;
          }
          .indicators-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header Title Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'hsl(var(--text-main))', letterSpacing: '-0.5px' }}>
            Finance & Benefits Utilization Analytics
          </h3>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.95rem', marginTop: 4 }}>
            Generate, audit, and analyze premium cost structures, health claim metrics, and approve newly created items.
          </p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="no-print" style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', marginBottom: 24, paddingBottom: 0 }}>
        <button 
          onClick={() => setActiveDashboardTab('analytics')}
          style={{
            background: 'none',
            border: 'none',
            color: activeDashboardTab === 'analytics' ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
            fontWeight: activeDashboardTab === 'analytics' ? 700 : 500,
            fontSize: '1rem',
            cursor: 'pointer',
            padding: '12px 20px',
            borderBottom: activeDashboardTab === 'analytics' ? '3px solid hsl(var(--primary))' : '3px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          Premium Analytics Hub
        </button>
        <button 
          onClick={() => setActiveDashboardTab('approvals')}
          style={{
            background: 'none',
            border: 'none',
            color: activeDashboardTab === 'approvals' ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
            fontWeight: activeDashboardTab === 'approvals' ? 700 : 500,
            fontSize: '1rem',
            cursor: 'pointer',
            padding: '12px 20px',
            borderBottom: activeDashboardTab === 'approvals' ? '3px solid hsl(var(--primary))' : '3px solid transparent',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease'
          }}
        >
          Financial Approvals Queue
          {pendingCount > 0 && (
            <span style={{
              background: 'hsl(var(--danger))',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: '50%',
              width: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}>
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {activeDashboardTab === 'approvals' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }} className="no-print">
          
          <div className="approvals-grid">
            
            {/* Benefit Plans Queue */}
            <div className="glass-panel" style={{ margin: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h4 style={{ fontWeight: 800, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                <Gift size={20} style={{ color: 'hsl(var(--primary))' }} />
                Pending Benefit Plans ({pendingPlans.length})
              </h4>
              
              {pendingPlans.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                  <CheckCircle size={32} style={{ color: 'hsl(var(--success))', marginBottom: 12, display: 'block', margin: '0 auto 12px auto' }} />
                  <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>All Benefit Plans are reviewed</p>
                  <p style={{ fontSize: '0.8rem', marginTop: 4 }}>New benefits created by HR will appear here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '520px', overflowY: 'auto', paddingRight: 4 }}>
                  {pendingPlans.map(plan => (
                    <div key={plan.planID} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 18, background: 'hsl(var(--bg-card))', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <h5 style={{ fontWeight: 700, fontSize: '1rem', color: 'hsl(var(--text-main))' }}>{plan.planName}</h5>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--primary))', background: 'hsla(var(--primary)/0.1)', padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginTop: 4 }}>
                          {plan.planType}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'hsl(var(--text-muted))', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div><strong>Eligibility Grade:</strong> {plan.eligibilityGrade}</div>
                        <div><strong>Coverage Limit:</strong> ${plan.coverageLimit.toLocaleString()}</div>
                        <div><strong>Employee Contribution:</strong> ${plan.employeeContribution}/mo</div>
                        <div><strong>Employer Contribution:</strong> ${plan.employerContribution}/mo</div>
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                        <button onClick={() => approvePlan(plan.planID)} className="btn btn-success" style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', height: 36 }}>
                          Approve Plan
                        </button>
                        <button onClick={() => rejectPlan(plan.planID)} className="btn btn-danger" style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', height: 36 }}>
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Catalog Items Queue */}
            <div className="glass-panel" style={{ margin: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h4 style={{ fontWeight: 800, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                <Coins size={20} style={{ color: 'hsl(var(--accent-purple))' }} />
                Pending Reward Store Items ({pendingCatalog.length})
              </h4>
              
              {pendingCatalog.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                  <CheckCircle size={32} style={{ color: 'hsl(var(--success))', marginBottom: 12, display: 'block', margin: '0 auto 12px auto' }} />
                  <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>All Reward Items are reviewed</p>
                  <p style={{ fontSize: '0.8rem', marginTop: 4 }}>Rewards items created by managers will appear here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '520px', overflowY: 'auto', paddingRight: 4 }}>
                  {pendingCatalog.map(item => (
                    <div key={item.itemID} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 18, background: 'hsl(var(--bg-card))', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <h5 style={{ fontWeight: 700, fontSize: '1rem', color: 'hsl(var(--text-main))' }}>{item.itemName}</h5>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--accent-purple))', background: 'rgba(124, 58, 237, 0.1)', padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginTop: 4 }}>
                          {item.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'hsl(var(--text-muted))', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div><strong>Points Required:</strong> {item.pointsRequired} pts</div>
                        <div><strong>Initial Quantity:</strong> {item.availableQuantity} units</div>
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                        <button onClick={() => approveCatalogItem(item.itemID)} className="btn btn-success" style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', height: 36 }}>
                          Approve Reward
                        </button>
                        <button onClick={() => rejectCatalogItem(item.itemID)} className="btn btn-danger" style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', height: 36 }}>
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      ) : (
        /* Analytics View (Original Custom Reports UI) */
        <div>
          {/* Top Console Area - Generator & Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 30 }} className="no-print">
            {/* Generator Panel */}
            <div className="glass-panel" style={{ margin: 0, padding: 24 }}>
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={18} className={isGenerating ? 'spin-animation' : ''} style={{ color: 'hsl(var(--primary))' }} />
                Generate Real-Time Analytics
              </h4>
              <form onSubmit={handleGenerateSubmit} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Scope Selection</label>
                  <select className="form-select" value={reportScope} onChange={e => setReportScope(e.target.value)} style={{ marginTop: 6, height: 42 }}>
                    <option value="Global">Global Enterprise</option>
                    <option value="Engineering">Engineering Department</option>
                    <option value="Sales">Sales Division</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: 42, padding: '0 20px' }} disabled={isGenerating}>
                  {isGenerating ? 'Querying...' : 'Generate Report'}
                </button>
              </form>
            </div>

            {/* Global Summary Panel */}
            <div className="glass-panel" style={{ margin: 0, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'hsla(var(--primary) / 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--primary))' }}>
                  <BarChart size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>Database Status</span>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: 2 }}>{reportsHistory.length} Total Reports Logged</h4>
                  <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', marginTop: 2 }}>
                    {reportsHistory.length > 0 ? `Latest generation on ${new Date(reportsHistory[0].generatedDate).toLocaleDateString()}` : 'No reports generated yet'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {reportsHistory.length > 0 && activeReport ? (
            <div className="dashboard-split-layout">
              
              {/* LEFT COLUMN: Active Report Detailed View */}
              <div className="glass-panel print-area" style={{ margin: 0, padding: 24 }}>
                
                {/* Detailed View Title & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24 }} className="no-print">
                  <div>
                    <span style={{ 
                      display: 'inline-block', 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent-purple)))', 
                      color: '#fff', 
                      padding: '2px 8px', 
                      borderRadius: 12, 
                      marginBottom: 6,
                      textTransform: 'uppercase'
                    }}>
                      {activeReport.scope} Scope
                    </span>
                    <h4 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'hsl(var(--text-main))' }}>
                      Analytical Report #{activeReport.reportID}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'hsl(var(--text-muted))', marginTop: 4 }}>
                      <Calendar size={14} />
                      <span>Generated: {new Date(activeReport.generatedDate).toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleCSVExport} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isExporting}>
                      <FileSpreadsheet size={16} />
                      {isExporting ? 'Exporting...' : 'Export CSV'}
                    </button>
                    <button onClick={handlePrint} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      <Printer size={16} />
                      Print Details
                    </button>
                  </div>
                </div>

                {/* PRINT-ONLY HEADER */}
                <div style={{ display: 'none' }} className="print-area-only">
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, borderBottom: '2px solid #333', paddingBottom: 10 }}>
                    WellBeing360 Corporate Report Analysis
                  </h2>
                  <table style={{ width: '100%', marginTop: 12, marginBottom: 20, borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 'bold', padding: '4px 0' }}>Report ID:</td>
                        <td>#{activeReport.reportID}</td>
                        <td style={{ fontWeight: 'bold', padding: '4px 0' }}>Scope:</td>
                        <td>{activeReport.scope}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 'bold', padding: '4px 0' }}>Generated Date:</td>
                        <td>{new Date(activeReport.generatedDate).toLocaleString()}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Core Summary KPIs */}
                <div className="kpi-summary-grid">
                  
                  {/* Enrollment Ring Meter */}
                  <div style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: 16, 
                    padding: 20, 
                    background: 'linear-gradient(135deg, hsla(var(--primary)/0.05), transparent)',
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>
                      Benefits Enrolment
                    </span>
                    <div style={{ position: 'relative', width: 120, height: 120 }}>
                      <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                        <circle cx="60" cy="60" r="50" fill="transparent" stroke="hsl(var(--border))" strokeWidth="8" />
                        <circle 
                          cx="60" 
                          cy="60" 
                          r="50" 
                          fill="transparent" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth="8" 
                          strokeDasharray={2 * Math.PI * 50}
                          strokeDashoffset={(2 * Math.PI * 50) * (1 - activeReport.metrics.EnrolmentRate / 100)}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        />
                      </svg>
                      <div style={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center' 
                      }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--text-main))' }}>
                          {activeReport.metrics.EnrolmentRate}%
                        </span>
                      </div>
                    </div>
                    {priorReport && (
                      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {(() => {
                          const trend = calculateTrend(activeReport.metrics.EnrolmentRate, priorReport.metrics.EnrolmentRate, true);
                          if (!trend) return null;
                          return (
                            <span style={{ 
                              fontSize: '0.75rem', 
                              fontWeight: 700, 
                              color: trend.isPositive ? 'hsl(var(--success))' : 'hsl(var(--danger))',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 2
                            }}>
                              {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {trend.formatted} vs prior
                            </span>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* General Highlights (Premium Costs & Claims) */}
                  <div style={{ display: 'grid', gridRowGap: 16 }}>
                    
                    {/* Premium Cost Highlight */}
                    <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>
                          Total Premium Cost
                        </span>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'hsl(var(--text-main))', marginTop: 4 }}>
                          ${activeReport.metrics.PremiumCost.toLocaleString()}
                        </h3>
                      </div>
                      <div>
                        {priorReport && (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            {(() => {
                              const trend = calculateTrend(activeReport.metrics.PremiumCost, priorReport.metrics.PremiumCost, false);
                              if (!trend) return null;
                              return (
                                <span style={{ 
                                  fontSize: '0.75rem', 
                                  fontWeight: 700, 
                                  padding: '4px 8px', 
                                  borderRadius: 12,
                                  background: trend.isPositive ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                                  color: trend.isPositive ? 'hsl(var(--danger))' : 'hsl(var(--success))',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}>
                                  {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                  {trend.formatted} budget trend
                                </span>
                              );
                            })()}
                            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>versus prior run</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Claims Submitted Highlight */}
                    <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase' }}>
                          Audit Claims Volume
                        </span>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--text-main))', marginTop: 4 }}>
                          {activeReport.metrics.ClaimsSubmitted} Claims
                        </h3>
                      </div>
                      <div>
                        {priorReport && (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            {(() => {
                              const trend = calculateTrend(activeReport.metrics.ClaimsSubmitted, priorReport.metrics.ClaimsSubmitted, false);
                              if (!trend) return null;
                              return (
                                <span style={{ 
                                  fontSize: '0.75rem', 
                                  fontWeight: 700, 
                                  color: 'hsl(var(--text-muted))',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 2
                                }}>
                                  {trend.isPositive ? '+' : ''}{trend.diff.toFixed(1)} absolute claims
                                </span>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Detailed Categories Breakdown */}
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                  Segmented Service Performance Indicators
                </h4>
                
                <div className="indicators-grid">
                  
                  {/* Category 1: Wellness Engagement */}
                  <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
                    <h5 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                      <Users size={16} /> Wellness & Care Engagement
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                          <span style={{ color: 'hsl(var(--text-muted))' }}>Wellness Participation:</span>
                          <span style={{ fontWeight: 700 }}>{activeReport.metrics.WellnessParticipation} Active Users</span>
                        </div>
                        {/* Linear Progress Bar representation */}
                        <div style={{ height: 6, background: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ 
                            height: '100%', 
                            background: 'hsl(var(--primary))', 
                            width: `${Math.min((activeReport.metrics.WellnessParticipation / 20) * 100, 100)}%`, // Scaling relative to a sample 20 max user size
                            borderRadius: 3 
                          }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderTop: '1px dashed var(--border)', paddingTop: 10 }}>
                        <span style={{ color: 'hsl(var(--text-muted))' }}>EAP Counseling Sessions:</span>
                        <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <HeartHandshake size={14} style={{ color: 'hsl(var(--danger))' }} />
                          {activeReport.metrics.EAPUtilisation} Sessions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Rewards & Social Incentives */}
                  <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
                    <h5 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'hsl(var(--accent-purple))', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                      <Award size={16} /> Rewards & Recognition Budget
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span style={{ color: 'hsl(var(--text-muted))' }}>Peer Nominations Sent:</span>
                        <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Award size={14} style={{ color: 'hsl(var(--warning))' }} />
                          {activeReport.metrics.RecognitionCount} Kudos Awards
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderTop: '1px dashed var(--border)', paddingTop: 12 }}>
                        <span style={{ color: 'hsl(var(--text-muted))' }}>Reward Points Spent:</span>
                        <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Coins size={14} style={{ color: 'hsl(var(--warning))' }} />
                          {((activeReport?.metrics?.PointsRedeemed) ?? 0).toLocaleString()} points
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Prior Run Comparison Notification */}
                {priorReport ? (
                  <div style={{ marginTop: 24, padding: 12, background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                    <Info size={16} />
                    <span>
                      Comparing this report ({activeReport.scope}) against Report #{priorReport.reportID} generated on {new Date(priorReport.generatedDate).toLocaleDateString()}.
                    </span>
                  </div>
                ) : (
                  <div style={{ marginTop: 24, padding: 12, background: 'rgba(0,0,0,0.02)', border: '1px dashed var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                    <Info size={16} />
                    <span>No prior report available for comparative timeline analytics. Generate another report to unlock trends!</span>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: Interactive Saved Reports Selector */}
              <div className="glass-panel no-print" style={{ margin: 0, padding: 24, alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Saved Reports Logs
                </h4>
                <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.8rem', marginBottom: 16 }}>
                  Select any past generation below to load its full parameters into the analytical summary workspace.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: '480px', flex: 1, paddingRight: 4 }}>
                  {reportsHistory.map((rep) => {
                    const isActive = rep.reportID === selectedReportId;
                    return (
                      <div 
                        key={rep.reportID}
                        onClick={() => setSelectedReportId(rep.reportID)}
                        style={{ 
                          padding: '14px 16px',
                          border: isActive ? '1px solid hsl(var(--primary))' : '1px solid var(--border)',
                          borderRadius: 12,
                          background: isActive ? 'hsla(var(--primary) / 0.05)' : 'hsl(var(--bg-card))',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4
                        }}
                        className={isActive ? '' : 'history-row-clickable'}
                      >
                        {isActive && (
                          <div style={{ 
                            position: 'absolute', 
                            left: 0, 
                            top: 0, 
                            bottom: 0, 
                            width: 4, 
                            background: 'hsl(var(--primary))', 
                            borderTopLeftRadius: 12, 
                            borderBottomLeftRadius: 12 
                          }} />
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Report #{rep.reportID}</span>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            background: 'rgba(0,0,0,0.06)', 
                            padding: '2px 6px', 
                            borderRadius: 8, 
                            color: 'hsl(var(--text-dark))' 
                          }}>
                            {rep.scope}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: 4 }}>
                          <span>Cost: ${rep.metrics.PremiumCost.toLocaleString()}</span>
                          <span>Enrol: {rep.metrics.EnrolmentRate}%</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', textAlign: 'right', marginTop: 2 }}>
                          {new Date(rep.generatedDate).toLocaleDateString()} at {new Date(rep.generatedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel" style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '1rem' }}>
                No financial reports have been generated yet. Choose a scope and click the generate button above to aggregate real-time database details.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

