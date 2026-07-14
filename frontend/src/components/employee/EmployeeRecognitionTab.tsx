import React, { useState } from 'react';
import type { RecognitionAward } from '../../types';

interface EmployeeRecognitionTabProps {
  awards: RecognitionAward[];
  nominatePeer: (recipientID: string, category: string, badgeName: string, message: string) => Promise<void>;
}

export const EmployeeRecognitionTab: React.FC<EmployeeRecognitionTabProps> = ({
  awards,
  nominatePeer
}) => {
  const [nomineeID, setNomineeID] = useState('');
  const [awardCategory, setAwardCategory] = useState('PeerRecognition');
  const [awardBadge, setAwardBadge] = useState('🌟 Rockstar Colleague');
  const [awardMessage, setAwardMessage] = useState('');

  const handleNominationFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nominatePeer(nomineeID, awardCategory, awardBadge, awardMessage);
    setNomineeID('');
    setAwardMessage('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 30 }}>
      {/* Nominate Colleague */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Nominate & Congratulate a Peer</h3>
        <form onSubmit={handleNominationFormSubmit}>
          <div className="form-group">
            <label className="form-label">Recipient Employee ID</label>
            <input className="form-input" type="text" placeholder="e.g. EMP-928103" value={nomineeID} onChange={e => setNomineeID(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Recognition Category</label>
            <select className="form-select" value={awardCategory} onChange={e => setAwardCategory(e.target.value)}>
              <option value="PeerRecognition">Peer-to-Peer Recognition (+50 points)</option>
              <option value="ManagerNomination">Manager Nomination (+150 points)</option>
              <option value="InnovationAward">Innovation Spotlight (+250 points)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Award Badge Icon</label>
            <select className="form-select" value={awardBadge} onChange={e => setAwardBadge(e.target.value)}>
              <option value="🌟 Rockstar Colleague">🌟 Rockstar Colleague</option>
              <option value="🚀 Innovation Pioneer">🚀 Innovation Pioneer</option>
              <option value="🤝 Leadership Pillar">🤝 Team Leadership Pillar</option>
              <option value="💡 Critical Thinker">💡 Critical Thinker</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Convey a Thank You Message</label>
            <textarea className="form-input" rows={4} placeholder="Type your congrats details..." value={awardMessage} onChange={e => setAwardMessage(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Nominate & Award Points</button>
        </form>
      </div>

      {/* Wall of fame feed */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Public Recognition Wall</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '600px', overflowY: 'auto', paddingRight: 10 }}>
          {awards.length === 0 ? (
            <p style={{ color: 'hsl(var(--text-muted))' }}>No peer awards sent yet. Be the first to appreciate someone!</p>
          ) : (
            awards.map(aw => (
              <div key={aw.awardID} style={{ padding: 20, border: '1px solid var(--glass-border)', borderRadius: 12, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.3rem' }}>{aw.badgeName.split(' ')[0]}</span>
                    <strong style={{ fontSize: '0.95rem' }}>{aw.nominatorID} ➔ {aw.recipientID}</strong>
                  </div>
                  <span className="badge badge-primary">{aw.category}</span>
                </div>
                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'hsl(var(--text-main))', marginBottom: 8 }}>"{aw.message}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                  <span>{new Date(aw.awardDate).toLocaleDateString()}</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>+{aw.pointsAwarded} points</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
