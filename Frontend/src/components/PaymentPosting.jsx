import React, { useState } from 'react';
import api from '../api/client';

function PaymentPosting({ invoices, onPaymentPosted }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [payment, setPayment] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'check',
    reference: '',
    notes: ''
  });

  const openInvoices = invoices?.filter(inv => inv.balance > 0) || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setPayment(prev => ({ ...prev, amount: invoice.balance.toString() }));
    setError('');
    setSuccess(false);
  };

  const handleChange = (field, value) => {
    setPayment(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) {
      setError('Please select an invoice.');
      return;
    }

    const paymentAmount = parseFloat(payment.amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    if (paymentAmount > selectedInvoice.balance) {
      setError('Payment amount cannot exceed the balance due.');
      return;
    }

    try {
      setLoading(true);
      const newPaidAmount = selectedInvoice.paidAmount + paymentAmount;
      const newBalance = selectedInvoice.amount - newPaidAmount;
      const newStatus = newBalance === 0 ? 'paid' : 'partial';

      await api.put(`/invoices/${selectedInvoice.id}`, {
        paidAmount: newPaidAmount,
        balance: newBalance,
        status: newStatus
      });

      setSuccess(true);
      setSelectedInvoice(null);
      setPayment({
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        method: 'check',
        reference: '',
        notes: ''
      });
      if (onPaymentPosted) onPaymentPosted();
    } catch (err) {
      console.error('Error posting payment:', err);
      setError('Failed to post payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-posting">
      <h2>Payment Posting</h2>
      <p className="section-subtitle">Record payments against outstanding invoices.</p>

      {success && (
        <div className="success-box">
          ✅ Payment posted successfully!
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      <div className="payment-grid">
        {/* Invoice Selection */}
        <div className="payment-card">
          <h3>Select Invoice</h3>
          {openInvoices.length === 0 ? (
            <div className="empty-invoices">
              <p>No outstanding invoices found.</p>
            </div>
          ) : (
            <div className="invoice-select-list">
              {openInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`invoice-select-item ${selectedInvoice?.id === invoice.id ? 'selected' : ''}`}
                  onClick={() => handleInvoiceSelect(invoice)}
                >
                  <div className="select-item-main">
                    <span className="select-invoice-num">{invoice.invoiceNumber}</span>
                    <span className="select-balance">{formatCurrency(invoice.balance)}</span>
                  </div>
                  <div className="select-item-sub">
                    <span>{invoice.patientName}</span>
                    <span className={`invoice-status-badge status-${invoice.status}`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Form */}
        <div className="payment-card">
          <h3>Payment Details</h3>
          <form onSubmit={handleSubmit} className="payment-form">
            {selectedInvoice && (
              <div className="selected-invoice-summary">
                <div className="summary-row">
                  <span>Invoice:</span>
                  <strong>{selectedInvoice.invoiceNumber}</strong>
                </div>
                <div className="summary-row">
                  <span>Patient:</span>
                  <strong>{selectedInvoice.patientName}</strong>
                </div>
                <div className="summary-row">
                  <span>Balance Due:</span>
                  <strong className="balance-amount">{formatCurrency(selectedInvoice.balance)}</strong>
                </div>
              </div>
            )}

            <div className="field">
              <label>Payment Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={selectedInvoice?.balance || 0}
                placeholder="0.00"
                value={payment.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                disabled={!selectedInvoice}
                required
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label>Payment Date</label>
                <input
                  type="date"
                  value={payment.paymentDate}
                  onChange={(e) => handleChange('paymentDate', e.target.value)}
                  disabled={!selectedInvoice}
                />
              </div>
              <div className="field">
                <label>Payment Method</label>
                <select
                  value={payment.method}
                  onChange={(e) => handleChange('method', e.target.value)}
                  disabled={!selectedInvoice}
                >
                  <option value="check">Check</option>
                  <option value="eft">EFT/ACH</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Reference / Check #</label>
              <input
                type="text"
                placeholder="Check number or reference"
                value={payment.reference}
                onChange={(e) => handleChange('reference', e.target.value)}
                disabled={!selectedInvoice}
              />
            </div>

            <div className="field">
              <label>Notes</label>
              <input
                type="text"
                placeholder="Optional notes"
                value={payment.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                disabled={!selectedInvoice}
              />
            </div>

            <button 
              type="submit" 
              className="primary-btn" 
              disabled={loading || !selectedInvoice}
            >
              {loading ? 'Posting...' : 'Post Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentPosting;
