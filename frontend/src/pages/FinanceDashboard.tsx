import React, { useState } from 'react';
import type { BenefitsReport, BenefitPlan, RedemptionCatalog } from '../types';

import { FinanceReports } from '../components/finance/FinanceReports';
import { FinanceApprovals } from '../components/finance/FinanceApprovals';

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
  const [activeDashboardTab, setActiveDashboardTab] = useState<'analytics' | 'approvals'>('analytics');

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
        <FinanceApprovals
          plans={plans}
          catalog={catalog}
          approvePlan={approvePlan}
          rejectPlan={rejectPlan}
          approveCatalogItem={approveCatalogItem}
          rejectCatalogItem={rejectCatalogItem}
        />
      ) : (
        <FinanceReports
          reportsHistory={reportsHistory}
          generateReport={generateReport}
        />
      )}
    </div>
  );
};
