import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import InvoiceNavTabs from "../components/InvoiceNavTabs";
import InvoiceStats from "../components/InvoiceStats";
import InvoiceFilters from "../components/InvoiceFilters";
import InvoiceList from "../components/InvoiceList";
import InvoiceDetail from "../components/InvoiceDetail";
import CreateInvoice from "../components/CreateInvoice";
import PaymentPosting from "../components/PaymentPosting";
import PatientStatements from "../components/PatientStatements";
import DenialManagement from "../components/DenialManagement";
import ARDashboard from "../components/ARDashboard";
import ERAImport from "../components/ERAImport";

function InvoiceManagement() {
  const [activeTab, setActiveTab] = useState('list');
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    claimType: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchStats();
    fetchPatients();
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.claimType && filters.claimType !== 'all') params.append('claimType', filters.claimType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const res = await api.get(`/invoices?${params.toString()}`);
      setInvoices(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/invoices/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setActiveTab('detail');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'detail') {
      setSelectedInvoice(null);
    }
  };

  const handleDataChange = () => {
    fetchInvoices();
    fetchStats();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'list':
        return (
          <>
            <InvoiceStats stats={stats} />
            <section className="card">
              <h2>All Invoices</h2>
              <InvoiceFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
              />
              {error && <div className="error-box">{error}</div>}
              <InvoiceList 
                invoices={invoices} 
                loading={loading}
                onInvoiceClick={handleInvoiceSelect}
              />
            </section>
          </>
        );
      
      case 'detail':
        return (
          <section className="card">
            <InvoiceDetail 
              invoice={selectedInvoice}
              onBack={() => handleTabChange('list')}
              onDataChange={handleDataChange}
            />
          </section>
        );
      
      case 'create':
        return (
          <section className="card">
            <CreateInvoice onInvoiceCreated={handleDataChange} />
          </section>
        );
      
      case 'payment':
        return (
          <section className="card">
            <PaymentPosting 
              invoices={invoices}
              onPaymentPosted={handleDataChange}
            />
            <div className="era-section">
              <ERAImport 
                invoices={invoices}
                onPaymentsPosted={handleDataChange}
              />
            </div>
          </section>
        );

      case 'statements':
        return (
          <section className="card">
            <PatientStatements 
              invoices={invoices}
              patients={patients}
            />
          </section>
        );

      case 'denials':
        return (
          <section className="card">
            <DenialManagement 
              invoices={invoices}
              onDataChange={handleDataChange}
            />
          </section>
        );
      
      case 'dashboard':
        return (
          <section className="card">
            <ARDashboard invoices={invoices} stats={stats} />
          </section>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Invoice <span>Management</span></h1>
        <p className="subtitle">
          Complete RCM: Claims, Payments, Statements, Denials & Analytics
        </p>
      </header>

      <main className="app-main">
        <InvoiceNavTabs activeTab={activeTab} onTabChange={handleTabChange} />
        {renderTabContent()}
      </main>
    </div>
  );
}

export default InvoiceManagement;
