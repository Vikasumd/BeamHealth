import React from "react";

function PatientSelector({ patients, selectedPatientId, onChange }) {
  return (
    <div className="field">
      <label>Patient</label>
      <select
        value={selectedPatientId}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select a patient</option>
        {patients.map(p => (
          <option key={p.id} value={p.id}>
            {p.first_name} {p.last_name} (ID: {p.id})
          </option>
        ))}
      </select>
    </div>
  );
}

export default PatientSelector;
