import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/invoices.json');

const readInvoices = () => {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

const writeInvoices = (invoices) => {
  fs.writeFileSync(dataPath, JSON.stringify(invoices, null, 2));
};

export const findAll = () => {
  return readInvoices();
};

export const findById = (id) => {
  const invoices = readInvoices();
  return invoices.find(inv => inv.id === parseInt(id));
};

export const findByPatientId = (patientId) => {
  const invoices = readInvoices();
  return invoices.filter(inv => inv.patientId === parseInt(patientId));
};

export const findByStatus = (status) => {
  const invoices = readInvoices();
  return invoices.filter(inv => inv.status === status);
};

export const create = (invoiceData) => {
  const invoices = readInvoices();
  const newId = invoices.length > 0 ? Math.max(...invoices.map(i => i.id)) + 1 : 1;
  const newInvoice = { id: newId, ...invoiceData };
  invoices.push(newInvoice);
  writeInvoices(invoices);
  return newInvoice;
};

export const update = (id, updateData) => {
  const invoices = readInvoices();
  const index = invoices.findIndex(inv => inv.id === parseInt(id));
  if (index === -1) return null;
  invoices[index] = { ...invoices[index], ...updateData };
  writeInvoices(invoices);
  return invoices[index];
};

export const remove = (id) => {
  const invoices = readInvoices();
  const index = invoices.findIndex(inv => inv.id === parseInt(id));
  if (index === -1) return false;
  invoices.splice(index, 1);
  writeInvoices(invoices);
  return true;
};

export const getStats = () => {
  const invoices = readInvoices();
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  return {
    totalInvoices: invoices.length,
    totalOutstanding: invoices.reduce((sum, inv) => sum + inv.balance, 0),
    overdueCount: invoices.filter(inv => {
      const dueDate = new Date(inv.dueDate);
      return dueDate < today && inv.balance > 0;
    }).length,
    paidThisMonth: invoices.filter(inv => {
      const createdDate = new Date(inv.createdAt);
      return inv.status === 'paid' && 
             createdDate.getMonth() === thisMonth && 
             createdDate.getFullYear() === thisYear;
    }).reduce((sum, inv) => sum + inv.paidAmount, 0),
    byStatus: {
      draft: invoices.filter(inv => inv.status === 'draft').length,
      pending: invoices.filter(inv => inv.status === 'pending').length,
      submitted: invoices.filter(inv => inv.status === 'submitted').length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      partial: invoices.filter(inv => inv.status === 'partial').length,
      denied: invoices.filter(inv => inv.status === 'denied').length,
      appealed: invoices.filter(inv => inv.status === 'appealed').length
    }
  };
};
