import React, { useState, useMemo } from 'react';
import api from '../api/client';
import { 
  XCircleIcon, 
  CurrencyDollarIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon, 
  CheckCircleIcon, 
  PencilSquareIcon,
  PhoneIcon,
  ArrowPathIcon,
  ClockIcon,
  MinusCircleIcon
} from "@heroicons/react/24/solid";

// Common denial reason codes (CARC - Claim Adjustment Reason Codes)
const DENIAL_REASONS = [
  { code: 'CO-4', description: 'The procedure code is inconsistent with the modifier used' },
  { code: 'CO-16', description: 'Claim/service lacks information or has submission errors' },
  { code: 'CO-18', description: 'Exact duplicate claim/service' },
  { code: 'CO-22', description: 'This care may be covered by another payer' },
  { code: 'CO-29', description: 'The time limit for filing has expired' },
  { code: 'CO-45', description: 'Charges exceed fee schedule/maximum allowable' },
  { code: 'CO-50', description: 'Non-covered service' },
  { code: 'CO-96', description: 'Non-covered charge(s)' },
  { code: 'CO-97', description: 'The benefit for this service is included in another service' },
  { code: 'PR-1', description: 'Deductible amount' },
  { code: 'PR-2', description: 'Coinsurance amount' },
  { code: 'PR-3', description: 'Co-payment amount' },
  { code: 'OA-23', description: 'Claim awaiting provider authorization' }
];

function DenialManagement({ invoices, onDataChange }) {
  const [selectedDenial, setSelectedDenial] = useState(null);
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [appealData, setAppealData] = useState({
    reason: '',
    supportingInfo: '',
    correctedCodes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [activeView, setActiveView] = useState('list'); // list, detail, analytics

  // Filter denied invoices
  const deniedInvoices = useMemo(() => {
    return invoices?.filter(inv => inv.status === 'denied' || inv.status === 'appealed') || [];
  }, [invoices]);

  // Calculate denial analytics
  const analytics = useMemo(() => {
    const denied = invoices?.filter(inv => inv.status === 'denied') || [];
    const appealed = invoices?.filter(inv => inv.status === 'appealed') || [];
    const totalDeniedAmount = denied.reduce((sum, inv) => sum + inv.balance, 0);
    const totalAppealedAmount = appealed.reduce((sum, inv) => sum + inv.balance, 0);

    // Group by payer
    const byPayer = {};
    denied.forEach(inv => {
      if (!byPayer[inv.payerName]) {
        byPayer[inv.payerName] = { count: 0, amount: 0 };
      }
      byPayer[inv.payerName].count++;
      byPayer[inv.payerName].amount += inv.balance;
    });

    return {
      totalDenied: denied.length,
      totalAppealed: appealed.length,
      totalDeniedAmount,
      totalAppealedAmount,
      byPayer: Object.entries(byPayer)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.amount - a.amount)
    };
  }, [invoices]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSelectDenial = (invoice) => {
    setSelectedDenial(invoice);
    setActiveView('detail');
    setShowAppealForm(false);
    setSuccess('');
  };

  const handleAppealSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDenial) return;

    try {
      setLoading(true);
      await api.put(`/invoices/${selectedDenial.id}`, {
        status: 'appealed'
      });
      setSuccess('Appeal submitted successfully!');
      setShowAppealForm(false);
      setAppealData({ reason: '', supportingInfo: '', correctedCodes: '' });
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error('Error submitting appeal:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderList = () => (
    <div className="denial-list">
      <div className="denial-list-header">
        <h3>Denied Claims ({deniedInvoices.length})</h3>
        <button 
          className="secondary-btn"
          onClick={() => setActiveView('analytics')}
        >
          <ChartBarIcon className="btn-icon-svg" /> View Analytics
        </button>
      </div>

      {deniedInvoices.length === 0 ? (
        <div className="denial-empty">
          <div className="empty-icon"><CheckCircleIcon className="icon-lg-success" /></div>

          <h3>No Denied Claims</h3>
          <p>Great news! You don't have any denied claims at the moment.</p>
        </div>
      ) : (
        <div className="denial-table-wrapper">
          <table className="denial-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Patient</th>
                <th>Payer</th>
                <th>Amount</th>
                <th>Service Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deniedInvoices.map((invoice) => (
                <tr key={invoice.id} className="denial-row">
                  <td className="invoice-number">{invoice.invoiceNumber}</td>
                  <td>{invoice.patientName}</td>
                  <td>{invoice.payerName}</td>
                  <td className="amount">{formatCurrency(invoice.balance)}</td>
                  <td>{formatDate(invoice.serviceDate)}</td>
                  <td>
                    <span className={`invoice-status-badge status-${invoice.status}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn"
                      onClick={() => handleSelectDenial(invoice)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderDetail = () => (
    <div className="denial-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={() => setActiveView('list')}>
          ← Back to List
        </button>
        <h3>Denial Review: {selectedDenial?.invoiceNumber}</h3>
      </div>

      {success && <div className="success-box">{success}</div>}

      <div className="denial-detail-grid">
        {/* Claim Info */}
        <div className="denial-card">
          <h4>Claim Information</h4>
          <div className="info-list">
            <div className="info-row">
              <span>Patient:</span>
              <strong>{selectedDenial?.patientName}</strong>
            </div>
            <div className="info-row">
              <span>Payer:</span>
              <strong>{selectedDenial?.payerName}</strong>
            </div>
            <div className="info-row">
              <span>Service Date:</span>
              <strong>{formatDate(selectedDenial?.serviceDate)}</strong>
            </div>
            <div className="info-row">
              <span>Amount:</span>
              <strong className="amount-value">{formatCurrency(selectedDenial?.balance)}</strong>
            </div>
            <div className="info-row">
              <span>Status:</span>
              <span className={`invoice-status-badge status-${selectedDenial?.status}`}>
                {selectedDenial?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Denial Reason */}
        <div className="denial-card">
          <h4>Denial Reason (Simulated)</h4>
          <div className="denial-reason-box">
            <div className="reason-code">CO-16</div>
            <div className="reason-text">
              Claim/service lacks information or has submission errors. 
              Additional documentation may be required.
            </div>
          </div>
          <div className="codes-display">
            <span className="code-label">CPT Codes:</span>
            <div className="code-tags">
              {selectedDenial?.cptCodes?.map((code, i) => (
                <span key={i} className="code-tag cpt">{code}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Appeal Actions */}
        <div className="denial-card full-width">
          {selectedDenial?.status === 'denied' ? (
            <>
              {!showAppealForm ? (
                <div className="appeal-actions">
                  <h4>Appeal Options</h4>
                  <div className="action-buttons">
                    <button 
                      className="primary-btn"
                      onClick={() => setShowAppealForm(true)}
                    >
                      <PencilSquareIcon className="btn-icon-svg" /> File Appeal
                    </button>
                    <button className="secondary-btn">
                      <PhoneIcon className="btn-icon-svg" /> Contact Payer
                    </button>
                    <button className="secondary-btn">
                      <ArrowPathIcon className="btn-icon-svg" /> Resubmit Claim
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAppealSubmit} className="appeal-form">
                  <h4>File Appeal</h4>
                  <div className="field">
                    <label>Appeal Reason</label>
                    <select
                      value={appealData.reason}
                      onChange={(e) => setAppealData({...appealData, reason: e.target.value})}
                      required
                    >
                      <option value="">Select reason for appeal</option>
                      <option value="additional_docs">Additional Documentation Available</option>
                      <option value="coding_correction">Coding Correction</option>
                      <option value="medical_necessity">Medical Necessity Documentation</option>
                      <option value="timely_filing">Timely Filing Proof</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Supporting Information</label>
                    <textarea
                      value={appealData.supportingInfo}
                      onChange={(e) => setAppealData({...appealData, supportingInfo: e.target.value})}
                      placeholder="Explain why this denial should be overturned..."
                      rows={4}
                    />
                  </div>
                  <div className="field">
                    <label>Corrected Codes (if applicable)</label>
                    <input
                      type="text"
                      value={appealData.correctedCodes}
                      onChange={(e) => setAppealData({...appealData, correctedCodes: e.target.value})}
                      placeholder="e.g., 99214, J06.9"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="secondary-btn" onClick={() => setShowAppealForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="primary-btn" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Appeal'}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="appeal-status">
              <h4>Appeal Status</h4>
              <div className="status-timeline">
                <div className="timeline-item completed">
                  <div className="timeline-dot"><CheckCircleIcon className="icon-sm" /></div>
                  <div className="timeline-content">
                    <strong>Denial Received</strong>
                    <span>Original claim denied by payer</span>
                  </div>
                </div>
                <div className="timeline-item completed">
                  <div className="timeline-dot"><CheckCircleIcon className="icon-sm" /></div>
                  <div className="timeline-content">
                    <strong>Appeal Submitted</strong>
                    <span>Appeal filed with supporting documentation</span>
                  </div>
                </div>
                <div className="timeline-item active">
                  <div className="timeline-dot"><ClockIcon className="icon-sm" /></div>
                  <div className="timeline-content">
                    <strong>Under Review</strong>
                    <span>Payer is reviewing the appeal</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <strong>Decision</strong>
                    <span>Awaiting payer decision</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="denial-analytics">
      <div className="analytics-header">
        <button className="back-btn" onClick={() => setActiveView('list')}>
          ← Back to List
        </button>
        <h3>Denial Analytics</h3>
      </div>

      <div className="analytics-summary">
        <div className="analytics-card">

          <div className="analytics-content">
            <span className="analytics-value">{analytics.totalDenied}</span>
            <span className="analytics-label">Denied Claims</span>
          </div>
        </div>
        <div className="analytics-card">

          <div className="analytics-content">
            <span className="analytics-value denied">{formatCurrency(analytics.totalDeniedAmount)}</span>
            <span className="analytics-label">Denied Amount</span>
          </div>
        </div>
        <div className="analytics-card">

          <div className="analytics-content">
            <span className="analytics-value">{analytics.totalAppealed}</span>
            <span className="analytics-label">Under Appeal</span>
          </div>
        </div>
        <div className="analytics-card">

          <div className="analytics-content">
            <span className="analytics-value">
              {analytics.totalDenied > 0 
                ? Math.round((analytics.totalAppealed / (analytics.totalDenied + analytics.totalAppealed)) * 100)
                : 0}%
            </span>
            <span className="analytics-label">Appeal Rate</span>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-section">
          <h4>Denials by Payer</h4>
          <div className="payer-denial-list">
            {analytics.byPayer.map((payer, index) => (
              <div key={payer.name} className="payer-denial-item">
                <span className="payer-rank">#{index + 1}</span>
                <div className="payer-info">
                  <span className="payer-name">{payer.name}</span>
                  <span className="payer-count">{payer.count} denials</span>
                </div>
                <span className="payer-amount">{formatCurrency(payer.amount)}</span>
              </div>
            ))}
            {analytics.byPayer.length === 0 && (
              <p className="no-data">No denial data available</p>
            )}
          </div>
        </div>

        <div className="analytics-section">
          <h4>Common Denial Reasons</h4>
          <div className="reason-list">
            {DENIAL_REASONS.slice(0, 5).map((reason) => (
              <div key={reason.code} className="reason-item">
                <span className="reason-code">{reason.code}</span>
                <span className="reason-description">{reason.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="denial-management">
      <h2>Denial <span>Management</span></h2>
      <p className="section-subtitle">Track, appeal, and analyze denied claims.</p>

      {activeView === 'list' && renderList()}
      {activeView === 'detail' && selectedDenial && renderDetail()}
      {activeView === 'analytics' && renderAnalytics()}
    </div>
  );
}

export default DenialManagement;
