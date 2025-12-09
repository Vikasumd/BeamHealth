import React from "react";

function IntakePanel({ intake }) {
  if (!intake) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ color: '#9ca3af', margin: 0 }}>No intake data available.</p>
      </div>
    );
  }

  const InfoRow = ({ label, value }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
    }}>
      <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{label}</span>
      <strong style={{ color: '#e5e7eb', fontSize: '1rem' }}>{value}</strong>
    </div>
  );

  return (
    <div className="panel">
      <InfoRow label="Name" value={intake.name} />
      <InfoRow label="Date of Birth" value={intake.dob} />
      <InfoRow label="Email" value={intake.email} />
      <InfoRow label="Phone" value={intake.phone} />
      <InfoRow label="Gender" value={intake.gender === 'M' ? 'Male' : 'Female'} />
    </div>
  );
}

export default IntakePanel;
