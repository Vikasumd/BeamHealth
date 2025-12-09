import express from 'express';
import * as invoiceController from '../controllers/invoiceController.js';

const router = express.Router();

// GET /invoices - Get all invoices with optional filters
router.get('/', invoiceController.getAll);

// GET /invoices/stats - Get invoice statistics
router.get('/stats', invoiceController.getStats);

// GET /invoices/:id - Get single invoice by ID
router.get('/:id', invoiceController.getById);

// GET /invoices/patient/:patientId - Get invoices for a specific patient
router.get('/patient/:patientId', invoiceController.getByPatient);

// POST /invoices - Create new invoice
router.post('/', invoiceController.create);

// PUT /invoices/:id - Update invoice
router.put('/:id', invoiceController.update);

// DELETE /invoices/:id - Delete invoice
router.delete('/:id', invoiceController.remove);

export default router;
