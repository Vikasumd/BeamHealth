import React, { useMemo } from 'react';

function ARDashboard({ invoices, stats }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate aging buckets
  const agingData = useMemo(() => {
    const today = new Date();
    const buckets = {
      current: { count: 0, amount: 0 },
      '1-30': { count: 0, amount: 0 },
      '31-60': { count: 0, amount: 0 },
      '61-90': { count: 0, amount: 0 },
      '90+': { count: 0, amount: 0 }
    };

    invoices?.forEach(inv => {
      if (inv.balance <= 0) return;
      
      const dueDate = new Date(inv.dueDate);
      const daysPastDue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

      if (daysPastDue <= 0) {
        buckets.current.count++;
        buckets.current.amount += inv.balance;
      } else if (daysPastDue <= 30) {
        buckets['1-30'].count++;
        buckets['1-30'].amount += inv.balance;
      } else if (daysPastDue <= 60) {
        buckets['31-60'].count++;
        buckets['31-60'].amount += inv.balance;
      } else if (daysPastDue <= 90) {
        buckets['61-90'].count++;
        buckets['61-90'].amount += inv.balance;
      } else {
        buckets['90+'].count++;
        buckets['90+'].amount += inv.balance;
      }
    });

    return buckets;
  }, [invoices]);

  // Calculate status distribution
  const statusDistribution = useMemo(() => {
    if (!stats?.byStatus) return [];
    const colors = {
      draft: '#737373',
      pending: '#f59e0b',
      submitted: '#3b82f6',
      paid: '#10b981',
      partial: '#8b5cf6',
      denied: '#ef4444',
      appealed: '#ec4899'
    };

    return Object.entries(stats.byStatus)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        status,
        count,
        color: colors[status] || '#737373',
        percentage: Math.round((count / stats.totalInvoices) * 100)
      }));
  }, [stats]);

  // Calculate top payers
  const topPayers = useMemo(() => {
    const payerTotals = {};
    invoices?.forEach(inv => {
      if (!payerTotals[inv.payerName]) {
        payerTotals[inv.payerName] = { name: inv.payerName, total: 0, count: 0 };
      }
      payerTotals[inv.payerName].total += inv.amount;
      payerTotals[inv.payerName].count++;
    });

    return Object.values(payerTotals)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [invoices]);

  const totalAR = Object.values(agingData).reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="ar-dashboard">
      <h2>AR Dashboard</h2>
      <p className="section-subtitle">Accounts receivable analytics and aging reports.</p>

      {/* Summary Cards */}
      <div className="ar-summary-cards">
        <div className="ar-card highlight">
          <div className="ar-card-icon">💰</div>
          <div className="ar-card-content">
            <span className="ar-card-value">{formatCurrency(totalAR)}</span>
            <span className="ar-card-label">Total A/R</span>
          </div>
        </div>
        <div className="ar-card">
          <div className="ar-card-icon">📋</div>
          <div className="ar-card-content">
            <span className="ar-card-value">{stats?.totalInvoices || 0}</span>
            <span className="ar-card-label">Total Claims</span>
          </div>
        </div>
        <div className="ar-card warning">
          <div className="ar-card-icon">⚠️</div>
          <div className="ar-card-content">
            <span className="ar-card-value">{stats?.overdueCount || 0}</span>
            <span className="ar-card-label">Overdue</span>
          </div>
        </div>
        <div className="ar-card success">
          <div className="ar-card-icon">✅</div>
          <div className="ar-card-content">
            <span className="ar-card-value">{formatCurrency(stats?.paidThisMonth || 0)}</span>
            <span className="ar-card-label">Collected (Month)</span>
          </div>
        </div>
      </div>

      <div className="ar-grid">
        {/* Aging Buckets */}
        <div className="ar-section">
          <h3>📊 Aging Buckets</h3>
          <div className="aging-table">
            <div className="aging-header">
              <span>Period</span>
              <span>Claims</span>
              <span>Amount</span>
            </div>
            {[
              { key: 'current', label: 'Current', className: 'current' },
              { key: '1-30', label: '1-30 Days', className: 'days-30' },
              { key: '31-60', label: '31-60 Days', className: 'days-60' },
              { key: '61-90', label: '61-90 Days', className: 'days-90' },
              { key: '90+', label: '90+ Days', className: 'days-90-plus' }
            ].map(bucket => (
              <div key={bucket.key} className={`aging-row ${bucket.className}`}>
                <span className="aging-label">{bucket.label}</span>
                <span className="aging-count">{agingData[bucket.key].count}</span>
                <span className="aging-amount">{formatCurrency(agingData[bucket.key].amount)}</span>
              </div>
            ))}
            <div className="aging-row total">
              <span className="aging-label">Total</span>
              <span className="aging-count">
                {Object.values(agingData).reduce((sum, b) => sum + b.count, 0)}
              </span>
              <span className="aging-amount">{formatCurrency(totalAR)}</span>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="ar-section">
          <h3>📈 Status Distribution</h3>
          <div className="status-chart">
            {statusDistribution.map(item => (
              <div key={item.status} className="status-bar-item">
                <div className="status-bar-header">
                  <span className="status-name">{item.status}</span>
                  <span className="status-count">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="status-bar-track">
                  <div 
                    className="status-bar-fill"
                    style={{ 
                      width: `${item.percentage}%`, 
                      backgroundColor: item.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Payers */}
        <div className="ar-section">
          <h3>🏢 Top Payers</h3>
          <div className="top-payers-list">
            {topPayers.map((payer, index) => (
              <div key={payer.name} className="payer-item">
                <span className="payer-rank">#{index + 1}</span>
                <div className="payer-info">
                  <span className="payer-name">{payer.name}</span>
                  <span className="payer-count">{payer.count} claims</span>
                </div>
                <span className="payer-total">{formatCurrency(payer.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ARDashboard;
