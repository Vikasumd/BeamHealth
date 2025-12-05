import React from "react";

function RoutingPanel({ routing }) {
  if (!routing) {
    return (
      <div className="panel" style={{
        textAlign: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(34, 197, 94, 0.2)'
      }}>
        <p style={{ margin: 0, color: '#86efac', fontSize: '1rem', fontWeight: '600' }}>
          ✅ No routing needed. Insurance is eligible.
        </p>
      </div>
    );
  }

  return (
    <div className="panel" style={{
      background: 'rgba(239, 68, 68, 0.05)',
      border: '1px solid rgba(239, 68, 68, 0.2)'
    }}>
      <div style={{
        padding: '12px',
        background: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <strong style={{ color: '#fca5a5', fontSize: '1.05rem' }}>
          {routing.message}
        </strong>
      </div>

      {routing.denialExplanation && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px 0', color: '#9ca3af', fontSize: '0.85rem', fontWeight: '600' }}>
            EXPLANATION:
          </p>
          <p style={{ margin: 0, color: '#fca5a5' }}>
            {routing.denialExplanation}
          </p>
        </div>
      )}

      {routing.alternativePlans && routing.alternativePlans.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: '0 0 12px 0', color: '#9ca3af', fontSize: '0.85rem', fontWeight: '600' }}>
            ALTERNATIVE PLANS:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {routing.alternativePlans.map(plan => (
              <div key={plan.id} style={{
                padding: '12px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong style={{ color: '#93c5fd' }}>{plan.payer}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '2px' }}>
                    {plan.plan}
                  </div>
                </div>
                <span className={`status-badge ${plan.eligible ? 'status-available' : 'status-booked'}`}>
                  {plan.eligible ? 'Eligible' : 'Not Eligible'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {routing.selfPayEstimate && (
        <div style={{
          padding: '12px',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <strong style={{ color: '#c4b5fd' }}>Self-Pay Estimate:</strong>
          <span style={{ fontSize: '1.3rem', color: '#c4b5fd', fontWeight: '700' }}>
            ${routing.selfPayEstimate}
          </span>
        </div>
      )}
    </div>
  );
}

export default RoutingPanel;
