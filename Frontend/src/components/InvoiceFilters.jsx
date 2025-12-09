import React from 'react';

function InvoiceFilters({ filters, onFilterChange }) {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="invoice-filters">
      <div className="filter-row">
        <div className="filter-group search-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Invoice #, patient, or payer..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="filter-input search-input"
          />
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="denied">Denied</option>
            <option value="appealed">Appealed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Claim Type</label>
          <select
            value={filters.claimType || 'all'}
            onChange={(e) => handleChange('claimType', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="medical">Medical</option>
            <option value="dental">Dental</option>
            <option value="vision">Vision</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From Date</label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="filter-input date-input"
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="filter-input date-input"
          />
        </div>
      </div>

      {(filters.search || filters.status !== 'all' || filters.claimType !== 'all' || filters.startDate || filters.endDate) && (
        <button 
          className="clear-filters-btn"
          onClick={() => onFilterChange({ search: '', status: 'all', claimType: 'all', startDate: '', endDate: '' })}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default InvoiceFilters;
