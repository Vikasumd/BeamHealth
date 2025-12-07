import React from 'react';

function InvoiceStats({ stats }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!stats) {
    return (
      <div className="invoice-stats loading">
        <div className="stat-card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="invoice-stats">
      <div className="stat-card">
        <div className="stat-icon">📋</div>
        <div className="stat-content">
          <span className="stat-value">{stats.totalInvoices}</span>
          <span className="stat-label">Total Invoices</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <span className="stat-value outstanding">{formatCurrency(stats.totalOutstanding)}</span>
          <span className="stat-label">Outstanding</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⚠️</div>
        <div className="stat-content">
          <span className="stat-value overdue">{stats.overdueCount}</span>
          <span className="stat-label">Overdue</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <span className="stat-value paid">{formatCurrency(stats.paidThisMonth)}</span>
          <span className="stat-label">Paid This Month</span>
        </div>
      </div>
    </div>
  );
}

export default InvoiceStats;
