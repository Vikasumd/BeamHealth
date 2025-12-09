import * as invoiceRepository from '../repositories/invoiceRepository.js';

export const getAllInvoices = (filters = {}) => {
  let invoices = invoiceRepository.findAll();

  // Apply filters
  if (filters.status && filters.status !== 'all') {
    invoices = invoices.filter(inv => inv.status === filters.status);
  }

  if (filters.claimType && filters.claimType !== 'all') {
    invoices = invoices.filter(inv => inv.claimType === filters.claimType);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    invoices = invoices.filter(inv => 
      inv.invoiceNumber.toLowerCase().includes(searchLower) ||
      inv.patientName.toLowerCase().includes(searchLower) ||
      inv.payerName.toLowerCase().includes(searchLower)
    );
  }

  if (filters.startDate) {
    invoices = invoices.filter(inv => new Date(inv.serviceDate) >= new Date(filters.startDate));
  }

  if (filters.endDate) {
    invoices = invoices.filter(inv => new Date(inv.serviceDate) <= new Date(filters.endDate));
  }

  // Sort by createdAt descending (newest first)
  invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return invoices;
};

export const getInvoiceById = (id) => {
  return invoiceRepository.findById(id);
};

export const getInvoicesByPatient = (patientId) => {
  return invoiceRepository.findByPatientId(patientId);
};

export const getInvoiceStats = () => {
  return invoiceRepository.getStats();
};

export const createInvoice = (invoiceData) => {
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  return invoiceRepository.create({
    ...invoiceData,
    invoiceNumber,
    createdAt: new Date().toISOString().split('T')[0],
    paidAmount: 0,
    balance: invoiceData.amount
  });
};

export const updateInvoice = (id, updateData) => {
  return invoiceRepository.update(id, updateData);
};

export const deleteInvoice = (id) => {
  return invoiceRepository.remove(id);
};
