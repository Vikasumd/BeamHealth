import React, { useState, useEffect, useRef } from "react";

function PatientSearch({ patients, selectedPatient, onSelect, onCreateNew }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const wrapperRef = useRef(null);

  // Filter patients based on query
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = patients.filter(p => 
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(lowerQuery) ||
        p.email?.toLowerCase().includes(lowerQuery) ||
        p.phone?.includes(query)
      );
      setFilteredPatients(filtered);
    }
  }, [query, patients]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (patient) => {
    onSelect(patient);
    setQuery(`${patient.first_name} ${patient.last_name}`);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    if (selectedPatient) {
      onSelect(null); // Clear selection when typing
    }
  };

  const handleCreateNew = () => {
    setIsOpen(false);
    setQuery("");
    onCreateNew();
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <div className="field">
        <label>Patient</label>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search patient by name, email, or phone..."
          className={selectedPatient ? "input-selected" : ""}
        />
        {selectedPatient && (
          <span className="selected-badge">✓ Selected</span>
        )}
      </div>

      {isOpen && (
        <div className="autocomplete-dropdown">
          {filteredPatients.length > 0 ? (
            <>
              <div className="dropdown-header">
                {query ? `Results for "${query}"` : "All patients"}
              </div>
              {filteredPatients.map(patient => (
                <div
                  key={patient.id}
                  className={`dropdown-item ${selectedPatient?.id === patient.id ? 'dropdown-item--selected' : ''}`}
                  onClick={() => handleSelect(patient)}
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
          ) : (
            <div className="dropdown-empty">
              <p>No patients found for "{query}"</p>
            </div>
          )}
          
          <div className="dropdown-footer" onClick={handleCreateNew}>
            <span className="create-new-btn">+ Create New Patient</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientSearch;
