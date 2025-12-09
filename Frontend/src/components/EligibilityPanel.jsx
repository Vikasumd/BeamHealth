import React from "react";

function EligibilityPanel({ eligibility }) {
  if (!eligibility) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ color: '#6B7280', margin: 0 }}>No eligibility data.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(109, 40, 217, 0.3)'
      }}>
        <strong style={{ fontSize: '1.1rem' }}>Status:</strong>
        <span style={{
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: '700',
          background: eligibility.eligible 
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
          border: eligibility.eligible
            ? '1px solid rgba(4, 120, 87, 0.4)'
            : '1px solid rgba(185, 28, 28, 0.5)',
          color: eligibility.eligible ? '#047857' : '#991b1b'
        }}>
          {eligibility.eligible ? '✅ Eligible' : '❌ Not Eligible'}
        </span>
      </div>
      
      {eligibility.coPay !== null && (
        <p style={{ 
          margin: '12px 0',
          fontSize: '1.05rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <strong>Copay:</strong>
          <span style={{ 
            fontSize: '1.3rem', 
            color: '#6d28d9',
            fontWeight: '700'
          }}>
            ${eligibility.coPay}
          </span>
        </p>
      )}
      
      {eligibility.reason && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderLeft: '3px solid rgba(185, 28, 28, 0.6)',
          borderRadius: '6px'
        }}>
          <strong style={{ color: '#991b1b' }}>Reason:</strong>
          <p style={{ margin: '4px 0 0 0', color: '#991b1b' }}>
            {eligibility.reason}
          </p>
        </div>
      )}
    </div>
  );
}

export default EligibilityPanel;
