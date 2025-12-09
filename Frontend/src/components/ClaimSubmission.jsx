import React, { useState } from 'react';
import api from '../api/client';

function ClaimSubmission({ invoice, onClose, onSubmitted }) {
  const [step, setStep] = useState('preview'); // preview, submitting, success
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Generate simulated 837P EDI content
  const generate837P = () => {
    const today = new Date();
    const controlNumber = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    
    return `ISA*00*          *00*          *ZZ*BEAMHEALTH     *ZZ*${invoice.payerName?.toUpperCase().substring(0, 15).padEnd(15)}*${formatDate(today).replace(/\//g, '')}*${String(today.getHours()).padStart(2, '0')}${String(today.getMinutes()).padStart(2, '0')}*^*00501*${controlNumber}*0*P*:~
GS*HC*BEAMHEALTH*${invoice.payerId}*${formatDate(today).replace(/\//g, '')}*${String(today.getHours()).padStart(2, '0')}${String(today.getMinutes()).padStart(2, '0')}*${controlNumber}*X*005010X222A1~
ST*837*0001*005010X222A1~
BHT*0019*00*${invoice.invoiceNumber}*${formatDate(today).replace(/\//g, '')}*${String(today.getHours()).padStart(2, '0')}${String(today.getMinutes()).padStart(2, '0')}*CH~
NM1*41*2*BEAMHEALTH MEDICAL CENTER*****46*1234567890~
PER*IC*BILLING DEPT*TE*5551234567~
NM1*40*2*${invoice.payerName?.toUpperCase()}*****46*${invoice.payerId}~
HL*1**20*1~
NM1*85*2*BEAMHEALTH MEDICAL CENTER*****XX*1234567890~
N3*123 HEALTHCARE AVE~
N4*MEDICAL CITY*MC*12345~
REF*EI*123456789~
HL*2*1*22*0~
SBR*P*18*******CI~
NM1*IL*1*${invoice.patientName?.split(' ').pop()?.toUpperCase()}*${invoice.patientName?.split(' ')[0]?.toUpperCase()}****MI*${invoice.patientId}~
N3*123 PATIENT STREET~
N4*PATIENT CITY*PC*54321~
DMG*D8*19800101*M~
NM1*PR*2*${invoice.payerName?.toUpperCase()}*****PI*${invoice.payerId}~
CLM*${invoice.invoiceNumber}*${invoice.amount}***${invoice.claimType === 'medical' ? '11' : '21'}:B:1*Y*A*Y*Y~
DTP*431*D8*${formatDate(invoice.serviceDate).replace(/\//g, '')}~
${invoice.icdCodes?.map((code, i) => `HI*${i === 0 ? 'ABK' : 'ABF'}:${code.replace('.', '')}~`).join('\n') || 'HI*ABK:Z0000~'}
${invoice.cptCodes?.map((code, i) => `LX*${i + 1}~
SV1*HC:${code}:*${invoice.amount / (invoice.cptCodes?.length || 1)}*UN*1***1~
DTP*472*D8*${formatDate(invoice.serviceDate).replace(/\//g, '')}~`).join('\n') || ''}
SE*26*0001~
GE*1*${controlNumber}~
IEA*1*${controlNumber}~`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStep('submitting');

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await api.put(`/invoices/${invoice.id}`, {
        status: 'submitted'
      });
      setStep('success');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error('Error submitting claim:', err);
      setStep('preview');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload837P = () => {
    const content = generate837P();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber}_837P.edi`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (step === 'success') {
    return (
      <div className="claim-submission-modal">
        <div className="submission-content success-content">
          <div className="success-icon">✅</div>
          <h3>Claim Submitted Successfully!</h3>
          <p>Your claim has been submitted to the clearinghouse.</p>
          <div className="submission-details">
            <div className="detail-row">
              <span>Claim Number:</span>
              <strong>{invoice.invoiceNumber}</strong>
            </div>
            <div className="detail-row">
              <span>Payer:</span>
              <strong>{invoice.payerName}</strong>
            </div>
            <div className="detail-row">
              <span>Status:</span>
              <span className="invoice-status-badge status-submitted">Submitted</span>
            </div>
          </div>
          <button className="primary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  if (step === 'submitting') {
    return (
      <div className="claim-submission-modal">
        <div className="submission-content submitting-content">
          <div className="loading-spinner large"></div>
          <h3>Submitting Claim...</h3>
          <p>Connecting to clearinghouse and transmitting claim data.</p>
          <div className="submission-progress">
            <div className="progress-step completed">
              <span className="step-icon">✓</span>
              <span>Validating claim data</span>
            </div>
            <div className="progress-step active">
              <span className="step-icon">⏳</span>
              <span>Transmitting to clearinghouse</span>
            </div>
            <div className="progress-step">
              <span className="step-icon">○</span>
              <span>Confirming receipt</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="claim-submission-modal">
      <div className="submission-content">
        <div className="modal-header">
          <h3>Submit Claim: {invoice.invoiceNumber}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="claim-preview">
          <h4>Claim Summary</h4>
          <div className="preview-grid">
            <div className="preview-item">
              <span className="preview-label">Patient</span>
              <span className="preview-value">{invoice.patientName}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Payer</span>
              <span className="preview-value">{invoice.payerName}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Service Date</span>
              <span className="preview-value">{formatDate(invoice.serviceDate)}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Claim Type</span>
              <span className="preview-value">{invoice.claimType}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Amount</span>
              <span className="preview-value amount">${invoice.amount?.toFixed(2)}</span>
            </div>
          </div>

          <div className="codes-preview">
            <div className="codes-group">
              <span className="codes-label">CPT/HCPCS Codes:</span>
              <div className="codes-list">
                {invoice.cptCodes?.map((code, i) => (
                  <span key={i} className="code-tag cpt">{code}</span>
                ))}
              </div>
            </div>
            <div className="codes-group">
              <span className="codes-label">ICD-10 Codes:</span>
              <div className="codes-list">
                {invoice.icdCodes?.map((code, i) => (
                  <span key={i} className="code-tag icd">{code}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="edi-preview">
          <div className="edi-header">
            <h4>837P EDI Preview</h4>
            <button className="secondary-btn small" onClick={handleDownload837P}>
              📥 Download EDI
            </button>
          </div>
          <pre className="edi-content">
            {generate837P()}
          </pre>
        </div>

        <div className="submission-actions">
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="primary-btn" 
            onClick={handleSubmit}
            disabled={loading}
          >
            🚀 Submit to Clearinghouse
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClaimSubmission;
