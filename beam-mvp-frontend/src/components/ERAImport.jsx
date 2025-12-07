import React, { useState } from 'react';
import api from '../api/client';

function ERAImport({ invoices, onPaymentsPosted }) {
  const [eraData, setEraData] = useState('');
  const [parsedPayments, setParsedPayments] = useState([]);
  const [step, setStep] = useState('import'); // import, review, complete
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Simulate parsing ERA/835 data
  const parseERA = () => {
    // In production, this would parse actual 835 EDI format
    // For demo, we'll generate sample remittance data based on pending invoices
    const pendingInvoices = invoices?.filter(inv => 
      inv.status === 'submitted' || inv.status === 'pending'
    ) || [];

    const payments = pendingInvoices.slice(0, 3).map(inv => ({
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      patientName: inv.patientName,
      chargedAmount: inv.amount,
      allowedAmount: inv.amount * 0.85,
      paidAmount: inv.amount * 0.75,
      adjustmentAmount: inv.amount * 0.10,
      patientResponsibility: inv.amount * 0.15,
      adjustmentReasons: ['CO-45: Charges exceed fee schedule'],
      status: 'paid'
    }));

    setParsedPayments(payments);
    setStep('review');
  };

  const handleImport = () => {
    if (!eraData.trim()) {
      // Generate sample ERA data
      setSampleData();
    }
    parseERA();
  };

  const setSampleData = () => {
    const sampleERA = `ISA*00*          *00*          *ZZ*PAYER          *ZZ*BEAMHEALTH     *231207*1200*^*00501*000000001*0*P*:~
GS*HP*PAYER*BEAMHEALTH*20231207*1200*1*X*005010X221A1~
ST*835*0001*005010X221A1~
BPR*I*1250.00*C*ACH*CCP*01*123456789*DA*987654321*1234567890**01*123456789*DA*111111111*20231207~
TRN*1*TRACE123456*1234567890~
DTM*405*20231207~
N1*PR*SAMPLE PAYER~
N1*PE*BEAMHEALTH MEDICAL CENTER*XX*1234567890~
CLP*INV-2024-002*1*1250.00*937.50*312.50*12*CLM123456~
SVC*HC:99214*500.00*375.00**1~
CAS*CO*45*125.00~
DTM*472*20231120~
SE*15*0001~
GE*1*1~
IEA*1*000000001~`;
    setEraData(sampleERA);
  };

  const handlePostPayments = async () => {
    setLoading(true);

    try {
      const postedResults = [];

      for (const payment of parsedPayments) {
        const invoice = invoices.find(inv => inv.id === payment.invoiceId);
        if (invoice) {
          const newPaidAmount = invoice.paidAmount + payment.paidAmount;
          const newBalance = invoice.amount - newPaidAmount;
          const newStatus = newBalance <= 0 ? 'paid' : 'partial';

          await api.put(`/invoices/${invoice.id}`, {
            paidAmount: newPaidAmount,
            balance: Math.max(0, newBalance),
            status: newStatus
          });

          postedResults.push({
            ...payment,
            newBalance: Math.max(0, newBalance),
            newStatus
          });
        }
      }

      setResults(postedResults);
      setStep('complete');
      if (onPaymentsPosted) onPaymentsPosted();
    } catch (err) {
      console.error('Error posting payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEraData('');
    setParsedPayments([]);
    setStep('import');
    setResults(null);
  };

  if (step === 'complete') {
    return (
      <div className="era-import">
        <div className="era-success">
          <div className="success-icon">✅</div>
          <h3>Payments Posted Successfully!</h3>
          <p>{results.length} payment(s) have been applied to invoices.</p>

          <div className="posted-summary">
            <table className="era-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Patient</th>
                  <th>Posted</th>
                  <th>New Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => (
                  <tr key={i}>
                    <td className="invoice-number">{result.invoiceNumber}</td>
                    <td>{result.patientName}</td>
                    <td className="amount posted">{formatCurrency(result.paidAmount)}</td>
                    <td className={`amount ${result.newBalance > 0 ? 'balance' : 'zero'}`}>
                      {formatCurrency(result.newBalance)}
                    </td>
                    <td>
                      <span className={`invoice-status-badge status-${result.newStatus}`}>
                        {result.newStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="primary-btn" onClick={handleReset}>
            Import Another ERA
          </button>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="era-import">
        <div className="era-header">
          <button className="back-btn" onClick={() => setStep('import')}>
            ← Back
          </button>
          <h3>Review Remittance Data</h3>
        </div>

        <div className="era-summary">
          <div className="summary-stat">
            <span className="stat-label">Total Payments</span>
            <span className="stat-value">{parsedPayments.length}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Paid</span>
            <span className="stat-value">
              {formatCurrency(parsedPayments.reduce((sum, p) => sum + p.paidAmount, 0))}
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Adjustments</span>
            <span className="stat-value">
              {formatCurrency(parsedPayments.reduce((sum, p) => sum + p.adjustmentAmount, 0))}
            </span>
          </div>
        </div>

        <div className="era-payments-list">
          {parsedPayments.map((payment, index) => (
            <div key={index} className="era-payment-item">
              <div className="payment-header">
                <span className="invoice-number">{payment.invoiceNumber}</span>
                <span className="patient-name">{payment.patientName}</span>
              </div>
              <div className="payment-details">
                <div className="detail-col">
                  <span className="detail-label">Charged</span>
                  <span className="detail-value">{formatCurrency(payment.chargedAmount)}</span>
                </div>
                <div className="detail-col">
                  <span className="detail-label">Allowed</span>
                  <span className="detail-value">{formatCurrency(payment.allowedAmount)}</span>
                </div>
                <div className="detail-col">
                  <span className="detail-label">Paid</span>
                  <span className="detail-value paid">{formatCurrency(payment.paidAmount)}</span>
                </div>
                <div className="detail-col">
                  <span className="detail-label">Adjustment</span>
                  <span className="detail-value adjustment">-{formatCurrency(payment.adjustmentAmount)}</span>
                </div>
                <div className="detail-col">
                  <span className="detail-label">Patient Resp.</span>
                  <span className="detail-value">{formatCurrency(payment.patientResponsibility)}</span>
                </div>
              </div>
              {payment.adjustmentReasons.length > 0 && (
                <div className="adjustment-reasons">
                  {payment.adjustmentReasons.map((reason, i) => (
                    <span key={i} className="reason-tag">{reason}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="era-actions">
          <button className="secondary-btn" onClick={() => setStep('import')}>
            Cancel
          </button>
          <button 
            className="primary-btn" 
            onClick={handlePostPayments}
            disabled={loading || parsedPayments.length === 0}
          >
            {loading ? 'Posting...' : `Post ${parsedPayments.length} Payment(s)`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="era-import">
      <h3>Import ERA/835 Remittance</h3>
      <p className="section-subtitle">
        Paste ERA data or load sample data to auto-match payments to claims.
      </p>

      <div className="era-input-section">
        <div className="era-textarea-wrapper">
          <label>Paste 835 ERA Data</label>
          <textarea
            value={eraData}
            onChange={(e) => setEraData(e.target.value)}
            placeholder="Paste 835 ERA/Remittance data here..."
            rows={10}
          />
        </div>

        <div className="era-options">
          <button className="secondary-btn" onClick={setSampleData}>
            📋 Load Sample Data
          </button>
          <button className="secondary-btn">
            📁 Upload ERA File
          </button>
        </div>
      </div>

      <button 
        className="primary-btn" 
        onClick={handleImport}
      >
        🔍 Parse & Match Payments
      </button>
    </div>
  );
}

export default ERAImport;
