import React, { useState } from "react";

function NewPatientForm({ onPatientCreated, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    phone: "",
    gender: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.first_name || !formData.last_name || !formData.dob) {
      setError("First name, last name, and DOB are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to create patient");

      const newPatient = await response.json();
      onPatientCreated(newPatient);
    } catch (err) {
      setError("Failed to create patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-patient-form">
      <div className="form-header">
        <h3>New Patient Registration</h3>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label>First Name *</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="John"
            />
          </div>
          <div className="field">
            <label>Last Name *</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Appleseed"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="555-0123"
            />
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewPatientForm;
