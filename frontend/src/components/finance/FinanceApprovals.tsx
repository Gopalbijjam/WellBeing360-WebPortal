import React from 'react';
import { Gift, Coins, CheckCircle } from 'lucide-react';
import type { BenefitPlan, RedemptionCatalog } from '../../types';

interface FinanceApprovalsProps {
  plans: BenefitPlan[];
  catalog: RedemptionCatalog[];
  approvePlan: (id: number) => Promise<void>;
  rejectPlan: (id: number) => Promise<void>;
  approveCatalogItem: (id: number) => Promise<void>;
  rejectCatalogItem: (id: number) => Promise<void>;
}

export const FinanceApprovals: React.FC<FinanceApprovalsProps> = ({
  plans,
  catalog,
  approvePlan,
  rejectPlan,
  approveCatalogItem,
  rejectCatalogItem
}) => {
  const pendingPlans = plans.filter(p => p.status === 'PendingApproval');
  const pendingCatalog = catalog.filter(item => item.status === 'PendingApproval');

  return (
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
  );
};
