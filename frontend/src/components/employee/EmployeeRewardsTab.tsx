import React from 'react';
import { Star } from 'lucide-react';
import type { RewardPoints, RedemptionCatalog } from '../../types';

interface EmployeeRewardsTabProps {
  points: RewardPoints | null;
  catalog: RedemptionCatalog[];
  redeemItem: (itemID: number) => Promise<void>;
}

export const EmployeeRewardsTab: React.FC<EmployeeRewardsTabProps> = ({
  points,
  catalog,
  redeemItem
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Employee Rewards & Gift Redemption Catalog</h3>
          <p style={{ color: 'hsl(var(--text-muted))' }}>Redeem your wellness points for physical gifts, vouchers, and charitable donations.</p>
        </div>
        {points && (
          <div className="points-pill">
            <Star size={16} fill="black" />
            <span>{points.balance} Points Balance</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {catalog.filter(item => item.status !== 'PendingApproval').map(item => (
          <div key={item.itemID} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 0 }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: 12 }}>{item.category}</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8 }}>{item.itemName}</h4>
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginBottom: 16 }}>Available Quantity: {item.availableQuantity}</p>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>{item.pointsRequired} pts</span>
                <span className={`badge ${item.status === 'Available' ? 'badge-success' : 'badge-danger'}`}>{item.status}</span>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} disabled={item.status !== 'Available' || (points ? points.balance < item.pointsRequired : true)} onClick={() => redeemItem(item.itemID)}>
                Redeem Gift
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
