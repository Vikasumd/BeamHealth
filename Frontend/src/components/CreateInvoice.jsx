import React, { useState, useEffect } from 'react';
import api from '../api/client';

function CreateInvoice({ onInvoiceCreated, patients: propPatients }) {
  const [patients, setPatients] = useState(propPatients || []);
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    payerId: '',
    payerName: '',
    serviceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    amount: '',
    claimType: 'medical',
    cptCodes: '',
    icdCodes: '',
    description: ''
  });

  useEffect(() => {
    fetchPatients();
    fetchInsurances();
  }, []);

  useEffect(() => {
    // Auto-set due date to 30 days after service date
    if (formData.serviceDate) {
      const dueDate = new Date(formData.serviceDate);
      dueDate.setDate(dueDate.getDate() + 30);
      setFormData(prev => ({ ...prev, dueDate: dueDate.toISOString().split('T')[0] }));
    }
  }, [formData.serviceDate]);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchInsurances = async () => {
    try {
      const res = await api.get('/insurances');
      setInsurances(res.data);
    } catch (err) {
      console.error('Error fetching insurances:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess(false);
  };

  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    const patient = patients.find(p => p.id === parseInt(patientId));
    setFormData(prev => ({
      ...prev,
      patientId,
      patientName: patient ? `${patient.first_name} ${patient.last_name}` : ''
    }));
  };

  const handlePayerChange = (e) => {
    const payerId = e.target.value;
    const payer = insurances.find(i => i.id === parseInt(payerId));
    setFormData(prev => ({
      ...prev,
      payerId,
      payerName: payer ? payer.payer : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.patientId || !formData.payerId || !formData.amount) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const invoiceData = {
        ...formData,
        patientId: parseInt(formData.patientId),
        payerId: parseInt(formData.payerId),
        amount: parseFloat(formData.amount),
        cptCodes: formData.cptCodes.split(',').map(c => c.trim()).filter(Boolean),
        icdCodes: formData.icdCodes.split(',').map(c => c.trim()).filter(Boolean),
        status: 'draft'
      };

      await api.post('/invoices', invoiceData);
      setSuccess(true);
      setFormData({
        patientId: '',
        patientName: '',
        payerId: '',
        payerName: '',
        serviceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        amount: '',
        claimType: 'medical',
        cptCodes: '',
        icdCodes: '',
        description: ''
      });
      if (onInvoiceCreated) onInvoiceCreated();
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-invoice">
      <h2>Create New Invoice</h2>
      <p className="section-subtitle">Fill in the details below to generate a new invoice or claim.</p>

      {success && (
        <div className="success-box">
          ✅ Invoice created successfully!
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-section">
          <h3>Patient & Payer</h3>
          <div className="form-row">
            <div className="field">
              <label>Patient *</label>
              <select value={formData.patientId} onChange={handlePatientChange} required>
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Insurance / Payer *</label>
              <select value={formData.payerId} onChange={handlePayerChange} required>
                <option value="">Select Payer</option>
                {insurances.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.payer} - {i.plan}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Service Details</h3>
          <div className="form-row">
            <div className="field">
              <label>Service Date *</label>
              <input
                type="date"
                value={formData.serviceDate}
                onChange={(e) => handleChange('serviceDate', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
            <div className="field">
              <label>Claim Type</label>
              <select
                value={formData.claimType}
                onChange={(e) => handleChange('claimType', e.target.value)}
              >
                <option value="medical">Medical</option>
                <option value="dental">Dental</option>
                <option value="vision">Vision</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Billing</h3>
          <div className="form-row">
            <div className="field">
              <label>Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>CPT/HCPCS Codes</label>
              <input
                type="text"
                placeholder="99213, 85025"
                value={formData.cptCodes}
                onChange={(e) => handleChange('cptCodes', e.target.value)}
              />
            </div>
            <div className="field">
              <label>ICD-10 Codes</label>
              <input
                type="text"
                placeholder="J06.9, I10"
                value={formData.icdCodes}
                onChange={(e) => handleChange('icdCodes', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="field">
            <label>Description</label>
            <input
              type="text"
              placeholder="Brief description of services rendered"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice;
