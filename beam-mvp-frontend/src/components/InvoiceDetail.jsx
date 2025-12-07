import React, { useState } from 'react';
import ClaimSubmission from './ClaimSubmission';

function InvoiceDetail({ invoice, onBack, onDataChange }) {
  const [showClaimSubmission, setShowClaimSubmission] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: 'Draft', className: 'status-draft' },
      pending: { label: 'Pending', className: 'status-pending' },
      submitted: { label: 'Submitted', className: 'status-submitted' },
      paid: { label: 'Paid', className: 'status-paid' },
      partial: { label: 'Partial', className: 'status-partial' },
      denied: { label: 'Denied', className: 'status-denied' },
      appealed: { label: 'Appealed', className: 'status-appealed' }
    };
    const config = statusConfig[status] || { label: status, className: '' };
    return <span className={`invoice-status-badge ${config.className}`}>{config.label}</span>;
  };

  if (!invoice) {
    return (
      <div className="invoice-detail-empty">
        <div className="empty-icon">📄</div>
        <h3>No Invoice Selected</h3>
        <p>Select an invoice from the Claims List to view its details.</p>
        <button className="primary-btn" onClick={onBack}>
          Go to Claims List
        </button>
      </div>
    );
  }

  const canSubmitClaim = invoice.status === 'draft' || invoice.status === 'pending';

  return (
    <div className="invoice-detail">
      {showClaimSubmission && (
        <ClaimSubmission 
          invoice={invoice}
          onClose={() => setShowClaimSubmission(false)}
          onSubmitted={() => {
            setShowClaimSubmission(false);
            if (onDataChange) onDataChange();
          }}
        />
      )}

      <div className="detail-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>← Back to List</button>
          <h2>{invoice.invoiceNumber}</h2>
          {getStatusBadge(invoice.status)}
        </div>
        <div className="header-actions">
          <button className="secondary-btn">✏️ Edit</button>
          {canSubmitClaim && (
            <button 
              className="primary-btn"
              onClick={() => setShowClaimSubmission(true)}
            >
              🚀 Submit Claim
            </button>
          )}
          {invoice.status === 'submitted' && (
            <button className="secondary-btn" disabled>
              ⏳ Awaiting Response
            </button>
          )}
        </div>
      </div>

      <div className="detail-grid">
        {/* Patient & Payer Info */}
        <div className="detail-card">
          <h3>Patient Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Patient Name</span>
              <span className="info-value">{invoice.patientName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Patient ID</span>
              <span className="info-value">#{invoice.patientId}</span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h3>Payer Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Payer</span>
              <span className="info-value">{invoice.payerName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Claim Type</span>
              <span className="info-value claim-type">{invoice.claimType}</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="detail-card">
          <h3>Dates</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Service Date</span>
              <span className="info-value">{formatDate(invoice.serviceDate)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Due Date</span>
              <span className="info-value">{formatDate(invoice.dueDate)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Created</span>
              <span className="info-value">{formatDate(invoice.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="detail-card financial-card">
          <h3>Financial Summary</h3>
          <div className="financial-grid">
            <div className="financial-item">
              <span className="financial-label">Total Amount</span>
              <span className="financial-value">{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Paid Amount</span>
              <span className="financial-value paid">{formatCurrency(invoice.paidAmount)}</span>
            </div>
            <div className="financial-item">
              <span className="financial-label">Balance Due</span>
              <span className={`financial-value ${invoice.balance > 0 ? 'balance' : 'zero'}`}>
                {formatCurrency(invoice.balance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="detail-card full-width">
        <h3>Service Codes</h3>
        <div className="codes-section">
          <div className="code-group">
            <span className="code-label">CPT/HCPCS Codes</span>
            <div className="code-tags">
              {invoice.cptCodes?.map((code, i) => (
                <span key={i} className="code-tag cpt">{code}</span>
              ))}
            </div>
          </div>
          {invoice.icdCodes?.length > 0 && (
            <div className="code-group">
              <span className="code-label">ICD-10 Diagnosis</span>
              <div className="code-tags">
                {invoice.icdCodes.map((code, i) => (
                  <span key={i} className="code-tag icd">{code}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="description-section">
          <span className="desc-label">Description</span>
          <p className="desc-text">{invoice.description}</p>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetail;
