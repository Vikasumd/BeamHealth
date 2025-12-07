import React from 'react';

function InvoiceList({ invoices, loading, onInvoiceClick }) {
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

  const getClaimTypeBadge = (type) => {
    const icons = { medical: '🏥', dental: '🦷', vision: '👁️' };
    return (
      <span className="claim-type-badge">
        {icons[type] || '📋'} {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="invoice-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading invoices...</p>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="invoice-list-empty">
        <div className="empty-icon">📭</div>
        <h3>No invoices found</h3>
        <p>Try adjusting your filters or create a new invoice.</p>
      </div>
    );
  }

  return (
    <div className="invoice-list-container">
      <div className="invoice-table-wrapper">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Patient</th>
              <th>Type</th>
              <th>Service Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Payer</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr 
                key={invoice.id} 
                className={`invoice-row ${onInvoiceClick ? 'clickable' : ''}`}
                onClick={() => onInvoiceClick && onInvoiceClick(invoice)}
              >
                <td className="invoice-number">{invoice.invoiceNumber}</td>
                <td className="patient-name">{invoice.patientName}</td>
                <td>{getClaimTypeBadge(invoice.claimType)}</td>
                <td>{formatDate(invoice.serviceDate)}</td>
                <td className={new Date(invoice.dueDate) < new Date() && invoice.balance > 0 ? 'overdue-date' : ''}>
                  {formatDate(invoice.dueDate)}
                </td>
                <td className="amount">{formatCurrency(invoice.amount)}</td>
                <td className={`balance ${invoice.balance > 0 ? 'has-balance' : 'zero-balance'}`}>
                  {formatCurrency(invoice.balance)}
                </td>
                <td>{getStatusBadge(invoice.status)}</td>
                <td className="payer-name">{invoice.payerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="invoice-list-footer">
        <span className="results-count">Showing {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}

export default InvoiceList;
