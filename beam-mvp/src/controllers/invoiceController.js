import * as invoiceService from '../services/invoiceService.js';

export const getAll = (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      claimType: req.query.claimType,
      search: req.query.search,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    const invoices = invoiceService.getAllInvoices(filters);
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

export const getById = (req, res) => {
  try {
    const invoice = invoiceService.getInvoiceById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
};

export const getByPatient = (req, res) => {
  try {
    const invoices = invoiceService.getInvoicesByPatient(req.params.patientId);
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching patient invoices:', error);
    res.status(500).json({ error: 'Failed to fetch patient invoices' });
  }
};

export const getStats = (req, res) => {
  try {
    const stats = invoiceService.getInvoiceStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching invoice stats:', error);
    res.status(500).json({ error: 'Failed to fetch invoice stats' });
  }
};

export const create = (req, res) => {
  try {
    const newInvoice = invoiceService.createInvoice(req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

export const update = (req, res) => {
  try {
    const updated = invoiceService.updateInvoice(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
};

export const remove = (req, res) => {
  try {
    const deleted = invoiceService.deleteInvoice(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
};
