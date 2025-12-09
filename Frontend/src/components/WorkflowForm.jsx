import React, { useState, useEffect } from "react";
import api from "../api/client";

function WorkflowForm({ insuranceId, onInsuranceChange, onRunWorkflow, loading }) {
  const [insurances, setInsurances] = useState([]);
  const [loadingInsurances, setLoadingInsurances] = useState(true);

  useEffect(() => {
    async function fetchInsurances() {
      try {
        setLoadingInsurances(true);
        const res = await api.get("/insurances");
        setInsurances(res.data || []);
      } catch (err) {
        console.error("Failed to load insurances:", err);
      } finally {
        setLoadingInsurances(false);
      }
    }
    fetchInsurances();
  }, []);

  return (
    <>
      <div className="field">
        <label>Insurance Plan</label>
        <select
          className="form-select"
          value={insuranceId}
          onChange={e => onInsuranceChange(e.target.value)}
          disabled={loadingInsurances}
        >
          <option value="">Select insurance plan</option>
          {insurances.map(ins => (
            <option key={ins.id} value={ins.id}>
              {ins.payer} - {ins.plan} {ins.eligible ? '✓ Eligible' : '✗ Not Eligible'}
            </option>
          ))}
        </select>
      </div>

      <button className="primary-btn" onClick={onRunWorkflow} disabled={loading || !insuranceId}>
        {loading ? "Running workflow..." : "Run Unified Workflow"}
      </button>
    </>
  );
}

export default WorkflowForm;
