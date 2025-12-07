import React from 'react';

const tabs = [
  { id: 'list', label: 'Claims List', icon: '📋' },
  { id: 'create', label: 'Create Invoice', icon: '➕' },
  { id: 'payment', label: 'Payment Posting', icon: '💳' },
  { id: 'statements', label: 'Patient Statements', icon: '📝' },
  { id: 'denials', label: 'Denial Mgmt', icon: '❌' },
  { id: 'dashboard', label: 'AR Dashboard', icon: '📊' }
];

function InvoiceNavTabs({ activeTab, onTabChange }) {
  return (
    <nav className="invoice-nav-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'nav-tab--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default InvoiceNavTabs;
