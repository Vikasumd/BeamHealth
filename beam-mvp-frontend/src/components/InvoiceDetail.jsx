import React, { useState } from 'react';
import ClaimSubmission from './ClaimSubmission';
import api from '../api/client';

function InvoiceDetail({ invoice, onBack, onDataChange }) {
  const [showClaimSubmission, setShowClaimSubmission] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
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

  const handleEditClick = () => {
    setEditData({
      serviceDate: formatDateForInput(invoice.serviceDate),
      dueDate: formatDateForInput(invoice.dueDate),
      amount: invoice.amount,
      paidAmount: invoice.paidAmount,
      description: invoice.description || '',
      cptCodes: invoice.cptCodes?.join(', ') || '',
      icdCodes: invoice.icdCodes?.join(', ') || '',
      status: invoice.status
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const amount = parseFloat(editData.amount);
      const paidAmount = parseFloat(editData.paidAmount);
      const balance = amount - paidAmount;
      
      await api.put(`/invoices/${invoice.id}`, {
        serviceDate: editData.serviceDate,
        dueDate: editData.dueDate,
        amount: amount,
        paidAmount: paidAmount,
        balance: Math.max(0, balance),
        description: editData.description,
        cptCodes: editData.cptCodes.split(',').map(c => c.trim()).filter(c => c),
        icdCodes: editData.icdCodes.split(',').map(c => c.trim()).filter(c => c),
        status: editData.status
      });
      setIsEditing(false);
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error('Error saving invoice:', err);
    } finally {
      setSaving(false);
    }
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
          {!isEditing ? (
            <>
              <button className="primary-btn" onClick={handleEditClick}>
                ✏️ Edit Invoice
              </button>
              {canSubmitClaim && (
                <button 
                  className="primary-btn"
                  onClick={() => setShowClaimSubmission(true)}
                >
                  🚀 Submit Claim
                </button>
              )}
            </>
          ) : (
            <>
              <button className="primary-btn cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="detail-grid">
        {/* Patient Info - Read only */}
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

        {/* Payer Info - Read only */}
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

        {/* Dates - Editable */}
        <div className="detail-card">
          <h3>Dates</h3>
          {isEditing ? (
            <div className="edit-fields">
              <div className="field">
                <label>Service Date</label>
                <input
                  type="date"
                  value={editData.serviceDate}
                  onChange={(e) => setEditData({...editData, serviceDate: e.target.value})}
                />
              </div>
              <div className="field">
                <label>Due Date</label>
                <input
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
                />
              </div>
            </div>
          ) : (
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
          )}
        </div>

        {/* Financial Summary - Editable */}
        <div className="detail-card financial-card">
          <h3>Financial Summary</h3>
          {isEditing ? (
            <div className="edit-fields">
              <div className="field">
                <label>Total Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editData.amount}
                  onChange={(e) => setEditData({...editData, amount: e.target.value})}
                />
              </div>
              <div className="field">
                <label>Paid Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editData.paidAmount}
                  onChange={(e) => setEditData({...editData, paidAmount: e.target.value})}
                />
              </div>
              <div className="field">
                <label>Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="denied">Denied</option>
                  <option value="appealed">Appealed</option>
                </select>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Service Codes - Editable */}
      <div className="detail-card full-width">
        <h3>Service Codes</h3>
        {isEditing ? (
          <div className="edit-fields-row">
            <div className="field">
              <label>CPT/HCPCS Codes (comma-separated)</label>
              <input
                type="text"
                value={editData.cptCodes}
                onChange={(e) => setEditData({...editData, cptCodes: e.target.value})}
                placeholder="99213, 85025"
              />
            </div>
            <div className="field">
              <label>ICD-10 Codes (comma-separated)</label>
              <input
                type="text"
                value={editData.icdCodes}
                onChange={(e) => setEditData({...editData, icdCodes: e.target.value})}
                placeholder="J06.9, I10"
              />
            </div>
          </div>
        ) : (
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
        )}
        
        {/* Description - Editable */}
        <div className="description-section">
          <span className="desc-label">Description</span>
          {isEditing ? (
            <textarea
              className="desc-textarea"
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              rows={3}
              placeholder="Enter service description..."
            />
          ) : (
            <p className="desc-text">{invoice.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetail;
