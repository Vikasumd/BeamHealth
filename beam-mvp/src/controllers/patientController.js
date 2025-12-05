const patientRepository = require('../repositories/patientRepository');
const formatter = require('../utils/formatter');

/**
 * Patient Controller - Handles patient-specific requests
 */
class PatientController {
  /**
   * Get all patients
   * GET /api/patients
   */
  async getAllPatients(req, res) {
    try {
      const patients = await patientRepository.findAll();
      res.json(
        formatter.successResponse(patients, 'Patients retrieved successfully')
      );
    } catch (error) {
      console.error('Get all patients error:', error);
      res.status(500).json(
        formatter.errorResponse(error.message, 500)
      );
    }
  }

  /**
   * Get patient by ID
   * GET /api/patients/:id
   */
  async getPatientById(req, res) {
    try {
      const { id } = req.params;
      const patient = await patientRepository.findById(id);

      if (!patient) {
        return res.status(404).json(
          formatter.errorResponse('Patient not found', 404)
        );
      }

      res.json(
        formatter.successResponse(patient, 'Patient retrieved successfully')
      );
    } catch (error) {
      console.error('Get patient error:', error);
      res.status(500).json(
        formatter.errorResponse(error.message, 500)
      );
    }
  }

  /**
   * Create new patient
   * POST /api/patients
   */
  async createPatient(req, res) {
    try {
      const patient = await patientRepository.create(req.body);
      
      res.status(201).json(
        formatter.successResponse(patient, 'Patient created successfully')
      );
    } catch (error) {
      console.error('Create patient error:', error);
      
      // Check for validation errors
      if (error.message.includes('Validation failed')) {
        return res.status(400).json(
          formatter.errorResponse(error.message, 400)
        );
      }
      
      res.status(500).json(
        formatter.errorResponse(error.message, 500)
      );
    }
  }

  /**
   * Update patient
   * PUT /api/patients/:id
   */
  async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const patient = await patientRepository.update(id, req.body);

      if (!patient) {
        return res.status(404).json(
          formatter.errorResponse('Patient not found', 404)
        );
      }

      res.json(
        formatter.successResponse(patient, 'Patient updated successfully')
      );
    } catch (error) {
      console.error('Update patient error:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json(
          formatter.errorResponse(error.message, 400)
        );
      }
      
      res.status(500).json(
        formatter.errorResponse(error.message, 500)
      );
    }
  }

  /**
   * Delete patient
   * DELETE /api/patients/:id
   */
  async deletePatient(req, res) {
    try {
      const { id } = req.params;
      const deleted = await patientRepository.delete(id);

      if (!deleted) {
        return res.status(404).json(
          formatter.errorResponse('Patient not found', 404)
        );
      }

      res.json(
        formatter.successResponse(null, 'Patient deleted successfully')
      );
    } catch (error) {
      console.error('Delete patient error:', error);
      res.status(500).json(
        formatter.errorResponse(error.message, 500)
      );
    }
  }

  /**
   * Search patients by name
   * GET /api/patients/search/:term
   */
  async searchPatients(req, res) {
    try {
      const { term } = req.params;
      const patients = await patientRepository.searchByName(term);

      res.json(
        formatter.successResponse(patients, `Found ${patients.length} matching patients`)
      );
    } catch (error) {
      console.error('Search patients error:', error);
      res.status(500).json(
        formatter.errorResponse(error.message, 500)
      );
    }
  }
}

module.exports = new PatientController();
