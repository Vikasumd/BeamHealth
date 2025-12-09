import React, { useState, useMemo } from 'react';

function PatientStatements({ invoices, patients }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Group invoices by patient with patient responsibility (balance)
  const patientBalances = useMemo(() => {
    const grouped = {};
    invoices?.forEach(inv => {
      if (inv.balance > 0) {
        if (!grouped[inv.patientId]) {
          grouped[inv.patientId] = {
            patientId: inv.patientId,
            patientName: inv.patientName,
            invoices: [],
            totalBalance: 0
          };
        }
        grouped[inv.patientId].invoices.push(inv);
        grouped[inv.patientId].totalBalance += inv.balance;
      }
    });
    return Object.values(grouped).sort((a, b) => b.totalBalance - a.totalBalance);
  }, [invoices]);

  const selectedPatientData = useMemo(() => {
    return patientBalances.find(p => p.patientId === selectedPatient);
  }, [patientBalances, selectedPatient]);

  const handleGenerateStatement = (patientId) => {
    setSelectedPatient(patientId);
    setShowPreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (showPreview && selectedPatientData) {
    return (
      <div className="statement-preview">
        <div className="preview-actions">
          <button className="back-btn" onClick={() => setShowPreview(false)}>
            ← Back to List
          </button>
          <div className="preview-buttons">
            <button className="secondary-btn" onClick={handlePrint}>
              🖨️ Print
            </button>
            <button className="primary-btn">
              📧 Email Statement
            </button>
          </div>
        </div>

        <div className="statement-document">
          <div className="statement-header">
            <div className="clinic-info">
              <h2>BeamHealth Medical Center</h2>
              <p>123 Healthcare Ave, Suite 100</p>
              <p>Medical City, MC 12345</p>
              <p>Phone: (555) 123-4567</p>
            </div>
            <div className="statement-meta">
              <h3>PATIENT STATEMENT</h3>
              <p><strong>Statement Date:</strong> {formatDate(new Date())}</p>
              <p><strong>Account #:</strong> {selectedPatientData.patientId}</p>
            </div>
          </div>

          <div className="patient-info-section">
            <h4>Bill To:</h4>
            <p className="patient-name-large">{selectedPatientData.patientName}</p>
            <p>123 Patient Street</p>
            <p>Patient City, PC 54321</p>
          </div>

          <div className="statement-summary">
            <div className="summary-item">
              <span>Previous Balance:</span>
              <span>{formatCurrency(0)}</span>
            </div>
            <div className="summary-item">
              <span>New Charges:</span>
              <span>{formatCurrency(selectedPatientData.totalBalance)}</span>
            </div>
            <div className="summary-item">
              <span>Payments/Adjustments:</span>
              <span>{formatCurrency(0)}</span>
            </div>
            <div className="summary-item total">
              <span>Amount Due:</span>
              <span>{formatCurrency(selectedPatientData.totalBalance)}</span>
            </div>
          </div>

          <div className="statement-details">
            <h4>Statement Details</h4>
            <table className="statement-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Charges</th>
                  <th>Insurance Paid</th>
                  <th>Patient Resp.</th>
                </tr>
              </thead>
              <tbody>
                {selectedPatientData.invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>{formatDate(inv.serviceDate)}</td>
                    <td>{inv.description || 'Medical Services'}</td>
                    <td>{formatCurrency(inv.amount)}</td>
                    <td>{formatCurrency(inv.paidAmount)}</td>
                    <td className="patient-resp">{formatCurrency(inv.balance)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="total-label">Total Amount Due:</td>
                  <td className="total-value">{formatCurrency(selectedPatientData.totalBalance)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="statement-footer">
            <div className="payment-options">
              <h4>Payment Options</h4>
              <ul>
                <li>💳 Pay online at www.beamhealth.com/pay</li>
                <li>📞 Call (555) 123-4567 to pay by phone</li>
                <li>✉️ Mail check to address above</li>
              </ul>
            </div>
            <div className="payment-reminder">
              <p><strong>Please pay within 30 days to avoid late fees.</strong></p>
              <p>Questions? Contact our billing department at (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-statements">
      <h2>Patient <span>Statements</span></h2>
      <p className="section-subtitle">Generate and send patient billing statements.</p>

      <div className="statements-grid">
        <div className="statements-list-section">
          <h3>Patients with Outstanding Balances</h3>
          
          {patientBalances.length === 0 ? (
            <div className="statements-empty">
              <div className="empty-icon">✅</div>
              <h4>No Outstanding Balances</h4>
              <p>All patient accounts are current.</p>
            </div>
          ) : (
            <div className="patient-balance-list">
              {patientBalances.map((patient) => (
                <div key={patient.patientId} className="patient-balance-item">
                  <div className="patient-balance-info">
                    <span className="patient-name">{patient.patientName}</span>
                    <span className="invoice-count">{patient.invoices.length} invoice(s)</span>
                  </div>
                  <div className="patient-balance-amount">
                    <span className="balance-value">{formatCurrency(patient.totalBalance)}</span>
                    <button 
                      className="generate-btn"
                      onClick={() => handleGenerateStatement(patient.patientId)}
                    >
                      Generate Statement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="statements-summary-section">
          <h3>Statement Summary</h3>
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-icon">👥</span>
              <div className="summary-data">
                <span className="summary-value">{patientBalances.length}</span>
                <span className="summary-label">Patients with Balance</span>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">💰</span>
              <div className="summary-data">
                <span className="summary-value">
                  {formatCurrency(patientBalances.reduce((sum, p) => sum + p.totalBalance, 0))}
                </span>
                <span className="summary-label">Total Patient A/R</span>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">📄</span>
              <div className="summary-data">
                <span className="summary-value">
                  {patientBalances.reduce((sum, p) => sum + p.invoices.length, 0)}
                </span>
                <span className="summary-label">Open Invoices</span>
              </div>
            </div>
          </div>

          <div className="batch-actions">
            <h4>Batch Actions</h4>
            <button className="secondary-btn full-width">
              📧 Send All Statements via Email
            </button>
            <button className="secondary-btn full-width">
              🖨️ Print All Statements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientStatements;
