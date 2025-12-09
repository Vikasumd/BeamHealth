import React, { useState, useEffect, useRef } from "react";
import api from "../api/client";

function EmployeeLookupForm({ patients, onPatientSelected, onPatientCreated }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isNewEmployee, setIsNewEmployee] = useState(false);
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState("");
  const wrapperRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    phone: "",
    gender: ""
  });

  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Filter patients based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients.slice(0, 5));
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = patients.filter(p =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(lowerQuery) ||
        p.email?.toLowerCase().includes(lowerQuery) ||
        p.phone?.includes(searchQuery)
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownOpen(true);
    setIsNewEmployee(false);
    setIsAutoFilled(false);
    setSelectedPatient(null);
    
    // Reset form when searching
    setFormData({
      first_name: "",
      last_name: "",
      dob: "",
      email: "",
      phone: "",
      gender: ""
    });
  };

  const handleSelectPatient = (patient) => {
    // Auto-fill the form with patient data
    setSelectedPatient(patient);
    setSearchQuery(`${patient.first_name} ${patient.last_name}`);
    setFormData({
      first_name: patient.first_name,
      last_name: patient.last_name,
      dob: patient.dob || "",
      email: patient.email || "",
      phone: patient.phone || "",
      gender: patient.gender || ""
    });
    setIsAutoFilled(true);
    setIsNewEmployee(false);
    setIsDropdownOpen(false);
    setError(""); // Clear any previous errors
    onPatientSelected(patient);
  };

  const handleCreateNew = () => {
    // Parse the search query to pre-fill name
    const nameParts = searchQuery.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    
    setFormData({
      first_name: firstName,
      last_name: lastName,
      dob: "",
      email: "",
      phone: "",
      gender: ""
    });
    setIsNewEmployee(true);
    setIsAutoFilled(false);
    setSelectedPatient(null);
    setIsDropdownOpen(false);
  };

  const handleFormChange = (e) => {
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

    setSaving(true);
    try {
      const response = await api.post("/patients", formData);
      const newPatient = response.data;
      onPatientCreated(newPatient);
      setSelectedPatient(newPatient);
      setIsAutoFilled(true);
      setIsNewEmployee(false);
      setSearchQuery(`${newPatient.first_name} ${newPatient.last_name}`);
    } catch (err) {
      setError("Failed to save employee. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setFormData({
      first_name: "",
      last_name: "",
      dob: "",
      email: "",
      phone: "",
      gender: ""
    });
    setIsAutoFilled(false);
    setIsNewEmployee(false);
    setSelectedPatient(null);
    onPatientSelected(null);
  };

  return (
    <div className="employee-lookup-form">
      <h2>Employee Information</h2>
      
      {/* Search Section */}
      <div className="lookup-section" ref={wrapperRef}>
        <div className="field search-field">
          <label>Search Employee</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Enter name, email, or phone to search..."
              className={isAutoFilled ? "input-selected" : ""}
            />
            {(isAutoFilled || searchQuery) && (
              <button type="button" className="clear-btn" onClick={handleClear}>
                ×
              </button>
            )}
            {isAutoFilled && (
              <span className="selected-badge">✓ Found</span>
            )}
          </div>
        </div>

        {isDropdownOpen && (
          <div className="autocomplete-dropdown">
            {filteredPatients.length > 0 ? (
              <>
                <div className="dropdown-header">
                  {searchQuery ? `Results for "${searchQuery}"` : "Recent employees"}
                </div>
                {filteredPatients.map(patient => (
                  <div
                    key={patient.id}
                    className={`dropdown-item ${selectedPatient?.id === patient.id ? 'dropdown-item--selected' : ''}`}
                    onClick={() => handleSelectPatient(patient)}
                  >
                    <div className="item-main">
                      <span className="item-name">{patient.first_name} {patient.last_name}</span>
                      <span className="item-id">ID: {patient.id}</span>
                    </div>
                    <div className="item-sub">
                      {patient.email && <span>{patient.email}</span>}
                      {patient.phone && <span> • {patient.phone}</span>}
                    </div>
                  </div>
                ))}
              </>
            ) : searchQuery ? (
              <div className="dropdown-empty">
                <p>No employee found for "{searchQuery}"</p>
              </div>
            ) : null}
            
            <div className="dropdown-footer" onClick={handleCreateNew}>
              <span className="create-new-btn">+ Add New Employee</span>
            </div>
          </div>
        )}
      </div>

      {/* Form Fields */}
      {(isAutoFilled || isNewEmployee) && (
        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label>First Name {isNewEmployee && "*"}</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleFormChange}
                placeholder="John"
                disabled={isAutoFilled}
                className={isAutoFilled ? "field-autofilled" : ""}
              />
            </div>
            <div className="field">
              <label>Last Name {isNewEmployee && "*"}</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleFormChange}
                placeholder="Smith"
                disabled={isAutoFilled}
                className={isAutoFilled ? "field-autofilled" : ""}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Date of Birth {isNewEmployee && "*"}</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleFormChange}
                disabled={isAutoFilled}
                className={isAutoFilled ? "field-autofilled" : ""}
              />
            </div>
            <div className="field">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleFormChange}
                disabled={isAutoFilled}
                className={isAutoFilled ? "field-autofilled" : ""}
              >
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
                onChange={handleFormChange}
                placeholder="john@example.com"
                disabled={isAutoFilled}
                className={isAutoFilled ? "field-autofilled" : ""}
              />
            </div>
            <div className="field">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="555-0123"
                disabled={isAutoFilled}
                className={isAutoFilled ? "field-autofilled" : ""}
              />
            </div>
          </div>

          {error && isNewEmployee && <div className="error-box">{error}</div>}

          {isNewEmployee && (
            <div className="form-actions">
              <button type="button" className="secondary-btn" onClick={handleClear}>
                Cancel
              </button>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Saving..." : "Save Employee"}
              </button>
            </div>
          )}
        </form>
      )}

      {isAutoFilled && (
        <div className="autofill-note">
          <span className="note-icon">✓</span>
          <span>Employee found! Details auto-filled from database.</span>
        </div>
      )}
    </div>
  );
}

export default EmployeeLookupForm;
