import React from "react";

function FollowUpPanel({ followUp }) {
  if (!followUp) return null;

  return (
    <div className="panel">
      <p><strong>Confirmation:</strong> {followUp.confirmation}</p>
      <p><strong>Eligibility Summary:</strong></p>
      <pre className="code-block">
        {JSON.stringify(followUp.eligibilitySummary, null, 2)}
      </pre>
      <p><strong>Reminder:</strong> {followUp.reminder}</p>
      <p><strong>Post-visit Task:</strong> {followUp.postVisitTask}</p>
    </div>
  );
}

export default FollowUpPanel;
