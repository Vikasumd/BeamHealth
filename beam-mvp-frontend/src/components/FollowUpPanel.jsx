import React from "react";

function FollowUpPanel({ followUp }) {
  if (!followUp) return null;

  const { confirmation, eligibilitySummary, reminder, postVisit } = followUp;

  return (
    <div className="followup-container">
      {/* Appointment Confirmation */}
      <div className="followup-section confirmation-section">
        <div className="section-icon">✅</div>
        <div className="section-content">
          <h3>Appointment Confirmation</h3>
          <p className="success-text">Your visit is confirmed!</p>
          <p><strong>{confirmation?.patientName}</strong> is scheduled for:</p>
          <div className="appointment-details">
            <div className="detail-row">
              <span className="detail-icon">📅</span>
              <span className="detail-text">{confirmation?.date}</span>
            </div>
            <div className="detail-row">
              <span className="detail-icon">⏰</span>
              <span className="detail-text">{confirmation?.time}</span>
            </div>
          </div>
          <p className="section-note">{confirmation?.message}</p>
        </div>
      </div>

      {/* Eligibility Summary */}
      <div className="followup-section eligibility-section">
        <div className="section-icon">🔍</div>
        <div className="section-content">
          <h3>Eligibility Summary</h3>
          <p className="section-subtitle">Here's a quick breakdown of coverage for this visit:</p>
          
          <div className="eligibility-grid">
            <div className="eligibility-item">
              <span className="item-label">Coverage Status:</span>
              <span className={`item-value ${eligibilitySummary?.isEligible ? 'eligible' : 'denied'}`}>
                {eligibilitySummary?.isEligible ? '✔️ Eligible' : '❌ Not Eligible'}
              </span>
            </div>
            
            {eligibilitySummary?.copay !== null && (
              <div className="eligibility-item">
                <span className="item-label">Copay Due at Visit:</span>
                <span className="item-value copay">${eligibilitySummary?.copay}</span>
              </div>
            )}
            
            <div className="eligibility-item">
              <span className="item-label">Notes:</span>
              <span className="item-value">{eligibilitySummary?.notes}</span>
            </div>
          </div>
          
          <p className="section-note">This summary automatically syncs with downstream billing tasks.</p>
        </div>
      </div>

      {/* Automated Reminder */}
      <div className="followup-section reminder-section">
        <div className="section-icon">🔔</div>
        <div className="section-content">
          <h3>Automated Reminder</h3>
          <p>{reminder?.message} {reminder?.timing}, including:</p>
          <ul className="reminder-list">
            {reminder?.includes?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="highlight-note">No manual follow-up work required.</p>
        </div>
      </div>

      {/* Post-Visit Workflow */}
      <div className="followup-section postvisit-section">
        <div className="section-icon">📝</div>
        <div className="section-content">
          <h3>Post-Visit Workflow</h3>
          <p>After the appointment, Beam will automatically:</p>
          <ul className="workflow-list">
            {postVisit?.automatedTasks?.map((task, index) => (
              <li key={index}>
                <span className="check-icon">✓</span>
                {task}
              </li>
            ))}
          </ul>
          <p className="highlight-note">{postVisit?.message}</p>
        </div>
      </div>
    </div>
  );
}

export default FollowUpPanel;
