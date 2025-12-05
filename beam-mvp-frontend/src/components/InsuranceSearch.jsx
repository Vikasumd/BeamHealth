import React, { useState, useEffect, useRef } from "react";
import api from "../api/client";

function InsuranceSearch({ selectedInsurance, onSelect }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [insurances, setInsurances] = useState([]);
  const [filteredInsurances, setFilteredInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef(null);

  // Fetch insurances on mount
  useEffect(() => {
    async function fetchInsurances() {
      try {
        const res = await api.get("/insurances");
        setInsurances(res.data || []);
        setFilteredInsurances(res.data || []);
      } catch (err) {
        console.error("Failed to load insurances:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInsurances();
  }, []);

  // Filter insurances based on query
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredInsurances(insurances);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = insurances.filter(i => {
        const combinedName = `${i.payer} - ${i.plan}`.toLowerCase();
        return (
          i.payer.toLowerCase().includes(lowerQuery) ||
          i.plan.toLowerCase().includes(lowerQuery) ||
          combinedName.includes(lowerQuery) ||
          combinedName === lowerQuery // Exact match for selected value
        );
      });
      // If query exactly matches a combined name, show all options
      const hasExactMatch = insurances.some(i => 
        `${i.payer} - ${i.plan}`.toLowerCase() === lowerQuery
      );
      setFilteredInsurances(hasExactMatch ? insurances : filtered);
    }
  }, [query, insurances]);

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

  const handleSelect = (insurance) => {
    onSelect(insurance);
    setQuery(`${insurance.payer} - ${insurance.plan}`);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    if (selectedInsurance) {
      onSelect(null);
    }
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <div className="field">
        <label>Insurance Plan</label>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={loading ? "Loading..." : "Search insurance by payer or plan..."}
          className={selectedInsurance ? "input-selected" : ""}
          disabled={loading}
        />
        {selectedInsurance && (
          <span className={`selected-badge ${selectedInsurance.eligible ? 'badge-eligible' : 'badge-denied'}`}>
            {selectedInsurance.eligible ? '✓ Eligible' : '✗ Not Eligible'}
          </span>
        )}
      </div>

      {isOpen && !loading && (
        <div className="autocomplete-dropdown">
          {filteredInsurances.length > 0 ? (
            <>
              <div className="dropdown-header">
                {query ? `Results for "${query}"` : "All insurance plans"}
              </div>
              {filteredInsurances.map(insurance => (
                <div
                  key={insurance.id}
                  className={`dropdown-item ${selectedInsurance?.id === insurance.id ? 'dropdown-item--selected' : ''}`}
                  onClick={() => handleSelect(insurance)}
                >
                  <div className="item-main">
                    <span className="item-name">{insurance.payer}</span>
                    <span className={`eligibility-badge ${insurance.eligible ? 'eligible' : 'denied'}`}>
                      {insurance.eligible ? '✓ Eligible' : '✗ Denied'}
                    </span>
                  </div>
                  <div className="item-sub">
                    <span>{insurance.plan}</span>
                    {insurance.coPay && <span> • Copay: ${insurance.coPay}</span>}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="dropdown-empty">
              <p>No insurance plans found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InsuranceSearch;
