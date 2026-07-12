import React, { useState } from 'react';
import type { RedemptionCatalog } from '../types';

interface RecognitionManagerConsoleProps {
  catalog: RedemptionCatalog[];
  createCatalogItem: (item: Partial<RedemptionCatalog>) => Promise<void>;
}

export const RecognitionManagerConsole: React.FC<RecognitionManagerConsoleProps> = ({
  catalog,
  createCatalogItem
}) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Voucher');
  const [pointsRequired, setPointsRequired] = useState(100);
  const [qty, setQty] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCatalogItem({
      itemName,
      category,
      pointsRequired,
      availableQuantity: qty,
      status: "Available"
    }).then(() => {
      setItemName('');
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 30 }}>
      <div className="glass-panel">
        <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Configure Redemption Catalog Item</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Item Name</label>
            <input className="form-input" type="text" value={itemName} onChange={e => setItemName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="Voucher">Gift Voucher</option>
              <option value="Merchandise">Merchandise Goods</option>
              <option value="Experience">Experience Pass</option>
              <option value="Charity">Charitable Donation</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Points Required</label>
              <input className="form-input" type="number" min={0} value={pointsRequired} onChange={e => setPointsRequired(Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Available Qty</label>
              <input className="form-input" type="number" min={0} value={qty} onChange={e => setQty(Number(e.target.value))} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Item to Catalog</button>
        </form>
      </div>

      <div className="glass-panel">
        <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Active Redemption Catalog</h4>
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Points Cost</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map(item => (
                <tr key={item.itemID}>
                  <td style={{ fontWeight: 600 }}>{item.itemName}</td>
                  <td>{item.category}</td>
                  <td style={{ color: '#fbbf24', fontWeight: 700 }}>{item.pointsRequired} pts</td>
                  <td>{item.availableQuantity} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
