import React, { useState } from 'react';
import { X, Calendar, PlusCircle } from 'lucide-react';
import type { EnrolmentWindow } from '../../types';

interface EnrolmentWindowsTabProps {
  windows: EnrolmentWindow[];
  createWindow: (window: Partial<EnrolmentWindow>) => Promise<void>;
}

export const EnrolmentWindowsTab: React.FC<EnrolmentWindowsTabProps> = ({
  windows,
  createWindow
}) => {
  const [isWindowModalOpen, setIsWindowModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Window Form State
  const [newWinYear, setNewWinYear] = useState(2026);
  const [newWinOpen, setNewWinOpen] = useState('');
  const [newWinClose, setNewWinClose] = useState('');
  const [newWinGrades, setNewWinGrades] = useState('G1,G2,G3,G4,G5,G6,G7');

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleWindowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createWindow({
        planYear: newWinYear,
        openDate: newWinOpen,
        closeDate: newWinClose,
        eligibleGrades: newWinGrades,
        status: "Open"
      });
      setNewWinOpen('');
      setNewWinClose('');
      setIsWindowModalOpen(false);
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
    border: focusedInput === id ? '1.5px solid #6366f1' : '1px solid #cbd5e1',
    color: '#0f172a',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    outline: 'none',
    boxShadow: focusedInput === id ? '0 0 0 3px rgba(99, 102, 241, 0.08)' : 'none',
    transition: 'all 0.15s ease-in-out'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Open Window Modal ── */}
      {isWindowModalOpen && (
        <div
          onClick={() => setIsWindowModalOpen(false)}
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
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} style={{ color: '#6366f1' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Open Enrolment Window</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>Schedule a new active timeline eligibility.</p>
                </div>
              </div>
              <button onClick={() => setIsWindowModalOpen(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWindowSubmit}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Plan Year</label>
                <input className="form-input" style={getInputStyle('winyear')} type="number" value={newWinYear} onChange={e => setNewWinYear(Number(e.target.value))} onFocus={() => setFocusedInput('winyear')} onBlur={() => setFocusedInput(null)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Open Date</label>
                  <input className="form-input" style={getInputStyle('winopen')} type="date" value={newWinOpen} onChange={e => setNewWinOpen(e.target.value)} onFocus={() => setFocusedInput('winopen')} onBlur={() => setFocusedInput(null)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Close Date</label>
                  <input className="form-input" style={getInputStyle('winclose')} type="date" value={newWinClose} onChange={e => setNewWinClose(e.target.value)} onFocus={() => setFocusedInput('winclose')} onBlur={() => setFocusedInput(null)} required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 28 }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Eligible Grades</label>
                <input className="form-input" style={getInputStyle('wingrades')} type="text" value={newWinGrades} onChange={e => setNewWinGrades(e.target.value)} onFocus={() => setFocusedInput('wingrades')} onBlur={() => setFocusedInput(null)} required />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, height: 44, borderRadius: 10, fontWeight: 700, border: '1px solid #cbd5e1', background: '#f8fafc' }} onClick={() => setIsWindowModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 2, height: 44, borderRadius: 10, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                  {isSubmitting ? 'Opening...' : 'Open Window'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)', borderRadius: 10, fontWeight: 700 }} onClick={() => setIsWindowModalOpen(true)}>
          <PlusCircle size={16} /> Open New Enrolment Window
        </button>
      </div>

      <div className="glass-panel" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)', width: '100%', margin: 0 }}>
        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 16, color: '#0f172a' }}>Enrolment Windows History</h4>
        <div className="table-wrapper" style={{ maxHeight: '420px', overflowY: 'auto' }}>
          <table className="custom-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Plan Year</th>
                <th>Open Date</th>
                <th>Close Date</th>
                <th>Grades Scope</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {windows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>No enrolment windows configured.</td>
                </tr>
              ) : windows.map(w => (
                <tr key={w.windowID}>
                  <td style={{ fontWeight: 700, color: '#1e293b' }}>{w.planYear}</td>
                  <td>{new Date(w.openDate).toLocaleDateString()}</td>
                  <td>{new Date(w.closeDate).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600, color: '#475569' }}>{w.eligibleGrades}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`badge ${w.status === 'Open' ? 'badge-success' : 'badge-danger'}`}>{w.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
