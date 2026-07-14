import React, { useState } from 'react';
import { PlusCircle, X, Gift } from 'lucide-react';
import type { RedemptionCatalog } from '../types';

interface RecognitionManagerConsoleProps {
  catalog: RedemptionCatalog[];
  createCatalogItem: (item: Partial<RedemptionCatalog>) => Promise<void>;
}

export const RecognitionManagerConsole: React.FC<RecognitionManagerConsoleProps> = ({
  catalog,
  createCatalogItem
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Voucher');
  const [pointsRequired, setPointsRequired] = useState(100);
  const [qty, setQty] = useState(10);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createCatalogItem({
        itemName,
        category,
        pointsRequired,
        availableQuantity: qty,
        status: "Available"
      });
      setItemName('');
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (id: string) => ({
    width: '100%',
    padding: '10px 14px',
    height: '42px',
    borderRadius: '10px',
    background: '#ffffff',
    border: focusedInput === id ? '1.5px solid #00d09c' : '1px solid #cbd5e1',
    color: '#0f172a',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    outline: 'none',
    boxShadow: focusedInput === id ? '0 0 0 3px rgba(0, 208, 156, 0.08)' : 'none',
    transition: 'all 0.15s ease-in-out'
  });

  const getSelectStyle = (id: string) => ({
    width: '100%',
    height: '42px',
    padding: '0 40px 0 14px',
    borderRadius: '10px',
    background: '#ffffff',
    border: focusedInput === id ? '1.5px solid #00d09c' : '1px solid #cbd5e1',
    color: '#0f172a',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    outline: 'none',
    boxShadow: focusedInput === id ? '0 0 0 3px rgba(0, 208, 156, 0.08)' : 'none',
    transition: 'all 0.15s ease-in-out',
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat'
  });

  return (
    <div>
      {/* ── Modal Overlay ── */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
            animation: 'fadeIn 0.15s ease'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 24,
              padding: 40,
              width: '100%',
              maxWidth: 480,
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.25)',
              border: '1px solid rgba(0,0,0,0.06)',
              animation: 'slideInUp 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,208,156,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gift size={20} style={{ color: '#00d09c' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Configure Catalog Item</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>Configure a new reward redemption catalog option.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Item Name</label>
                <input className="form-input" style={getInputStyle('itemname')} type="text" placeholder="E.g., INR 500 Gift Card" value={itemName} onChange={e => setItemName(e.target.value)} onFocus={() => setFocusedInput('itemname')} onBlur={() => setFocusedInput(null)} required />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Category</label>
                <select className="form-select" style={getSelectStyle('category')} value={category} onChange={e => setCategory(e.target.value)} onFocus={() => setFocusedInput('category')} onBlur={() => setFocusedInput(null)}>
                  <option value="Voucher">Gift Voucher</option>
                  <option value="Merchandise">Merchandise Goods</option>
                  <option value="Experience">Experience Pass</option>
                  <option value="Charity">Charitable Donation</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Points Required</label>
                  <input className="form-input" style={getInputStyle('points')} type="number" min={0} value={pointsRequired} onChange={e => setPointsRequired(Number(e.target.value))} onFocus={() => setFocusedInput('points')} onBlur={() => setFocusedInput(null)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Available Qty</label>
                  <input className="form-input" style={getInputStyle('qty')} type="number" min={0} value={qty} onChange={e => setQty(Number(e.target.value))} onFocus={() => setFocusedInput('qty')} onBlur={() => setFocusedInput(null)} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, height: 44, borderRadius: 10, fontWeight: 700, border: '1px solid #cbd5e1', background: '#f8fafc' }} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 2, height: 44, borderRadius: 10, fontWeight: 700, background: 'linear-gradient(135deg, #00d09c, #00b587)' }}>
                  {isSubmitting ? 'Adding...' : 'Add Item to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Redemption Store Catalog Console</h3>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #00d09c, #00b587)', boxShadow: '0 4px 12px rgba(0, 208, 156, 0.15)', borderRadius: 10, fontWeight: 700 }} onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={16} /> Add Redemption Catalog Item
          </button>
        </div>

        <div className="glass-panel" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)', width: '100%', margin: 0 }}>
          <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 16, color: '#0f172a' }}>Active Redemption Catalog</h4>
          <div className="table-wrapper" style={{ maxHeight: '440px', overflowY: 'auto' }}>
            <table className="custom-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Item Name</th>
                  <th style={{ width: '20%' }}>Category</th>
                  <th style={{ width: '15%' }}>Points Cost</th>
                  <th style={{ width: '15%' }}>Status</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {catalog.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>No catalog items registered.</td>
                  </tr>
                ) : catalog.map(item => (
                  <tr key={item.itemID}>
                    <td style={{ fontWeight: 700, color: '#1e293b' }}>{item.itemName}</td>
                    <td style={{ color: '#475569' }}>
                      <span className="badge badge-primary">{item.category}</span>
                    </td>
                    <td style={{ color: '#fbbf24', fontWeight: 800 }}>{item.pointsRequired} pts</td>
                    <td>
                      <span className={`badge ${item.status === 'Available' ? 'badge-success' : item.status === 'PendingApproval' ? 'badge-warning' : 'badge-danger'}`}>
                        {item.status || 'Available'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#334155' }}>{item.availableQuantity} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
