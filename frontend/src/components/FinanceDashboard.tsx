import React, { useState } from 'react';
import { BarChart, Gift, CheckCircle } from 'lucide-react';
import type { BenefitsReport } from '../types';

interface FinanceDashboardProps {
  reportsHistory: BenefitsReport[];
  generateReport: (scope: string) => Promise<void>;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  reportsHistory,
  generateReport
}) => {
  const [reportScope, setReportScope] = useState('Global');
  const latestReport = reportsHistory[0];

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateReport(reportScope);
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Finance & Benefits Utilization Analytics</h3>
      <p style={{ color: 'hsl(var(--text-muted))', marginBottom: 24 }}>Generate, track premium costs budgets and monitor program enrolments.</p>

      <div className="glass-panel" style={{ marginBottom: 30 }}>
        <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Generate Dynamic Financial Report</h4>
        <form onSubmit={handleGenerateSubmit} style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Report Scope</label>
            <select className="form-select" value={reportScope} onChange={e => setReportScope(e.target.value)}>
              <option value="Global">Global Enterprise</option>
              <option value="Engineering">Engineering Department</option>
              <option value="Sales">Sales Division</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Generate & Save Report
          </button>
        </form>
      </div>

      {latestReport ? (
        <div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon primary">
                <BarChart size={24} />
              </div>
              <div className="stat-info">
                <h3>Enrolment Rate</h3>
                <p>{latestReport.metrics.EnrolmentRate}%</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon success">
                <Gift size={24} />
              </div>
              <div className="stat-info">
                <h3>Premium Cost</h3>
                <p>${latestReport.metrics.PremiumCost.toLocaleString()}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon secondary">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <h3>Claims Ratio</h3>
                <p>{latestReport.metrics.ClaimsSubmitted} claims</p>
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Saved Reports History Logs</h4>
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Scope</th>
                    <th>Enrolment Rate</th>
                    <th>Premium Budget</th>
                    <th>EAP Session Bookings</th>
                    <th>Generated Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsHistory.map(rep => (
                    <tr key={rep.reportID}>
                      <td>#{rep.reportID}</td>
                      <td>{rep.scope}</td>
                      <td>{rep.metrics.EnrolmentRate}%</td>
                      <td>${rep.metrics.PremiumCost.toLocaleString()}</td>
                      <td>{rep.metrics.EAPUtilisation} sessions</td>
                      <td>{new Date(rep.generatedDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ color: 'hsl(var(--text-muted))' }}>No reports generated yet. Click generate to pull dynamic database metrics.</p>
      )}
    </div>
  );
};
