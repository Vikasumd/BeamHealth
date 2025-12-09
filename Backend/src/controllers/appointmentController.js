const appointmentRepository = require('../repositories/appointmentRepository');
const schedulingService = require('../services/schedulingService');
const followUpService = require('../services/followUpService');
const formatter = require('../utils/formatter');

/**
 * Appointment Controller - Handles appointment-specific requests
 */
class AppointmentController {
  /**
   * Get all appointments
   * GET /api/appointments
   */
  async getAllAppointments(req, res) {
    try {
      const appointments = await appointmentRepository.findAll();
      res.json(
        formatter.successResponse(appointments, 'Appointments retrieved successfully')
      );
    } catch (error) {
      console.error('Get all appointments error:', error);
      res.status(500).json(
        formatter.errorResponse(error.message, 500)
      );
    }
  }

  /**
   * Get appointment by ID
   * GET /api/appointments/:id
   */
  async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await appointmentRepository.findById(id);

      if (!appointment) {
        return res.status(404).json(
          formatter.errorResponse('Appointment not found', 404)
        );
      }

      res.json(
        formatter.successResponse(appointment, 'Appointment retrieved successfully')
      );
    } catch (error) {
      console.error('Get appointment error:', error);
      res.status(500).json(
        formatter.errorResponse(error.message, 500)
      );
    }
  }

  /**
   * Get appointments by patient ID
   * GET /api/appointments/patient/:patientId
   */
  async getAppointmentsByPatient(req, res) {
    try {
      const { patientId } = req.params;
      const appointments = await appointmentRepository.findByPatientId(patientId);

      res.json(
        formatter.successResponse(appointments, `Found ${appointments.length} appointments`)
      );
    } catch (error) {
      console.error('Get appointments by patient error:', error);
      res.status(500).json(
        formatter.errorResponse(error.message, 500)
      );
    }
  }

  /**
   * Get upcoming appointments
   * GET /api/appointments/upcoming
   */
  async getUpcomingAppointments(req, res) {
    try {
      const appointments = await appointmentRepository.findUpcoming();
      res.json(
        formatter.successResponse(appointments, `Found ${appointments.length} upcoming appointments`)
      );
    } catch (error) {
      console.error('Get upcoming appointments error:', error);
      res.status(500).json(
        formatter.errorResponse(error.message, 500)
      );
    }
  }

  /**
   * Create new appointment
   * POST /api/appointments
   */
  async createAppointment(req, res) {
    try {
      const appointment = await appointmentRepository.create(req.body);
      
      res.status(201).json(
        formatter.successResponse(appointment, 'Appointment created successfully')
      );
    } catch (error) {
      console.error('Create appointment error:', error);
      
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
   * Update appointment
   * PUT /api/appointments/:id
   */
  async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const appointment = await appointmentRepository.update(id, req.body);

      if (!appointment) {
        return res.status(404).json(
          formatter.errorResponse('Appointment not found', 404)
        );
      }

      res.json(
        formatter.successResponse(appointment, 'Appointment updated successfully')
      );
    } catch (error) {
      console.error('Update appointment error:', error);
      
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
   * Delete appointment
   * DELETE /api/appointments/:id
   */
  async deleteAppointment(req, res) {
    try {
      const { id } = req.params;
      const deleted = await appointmentRepository.delete(id);

      if (!deleted) {
        return res.status(404).json(
          formatter.errorResponse('Appointment not found', 404)
        );
      }

      res.json(
        formatter.successResponse(null, 'Appointment deleted successfully')
      );
    } catch (error) {
      console.error('Delete appointment error:', error);
      res.status(500).json(
        formatter.errorResponse(error.message, 500)
      );
    }
  }

  /**
   * Cancel appointment
   * POST /api/appointments/:id/cancel
   */
  async cancelAppointment(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const result = await schedulingService.cancelAppointment(id, reason || 'No reason provided');

      res.json(
        formatter.successResponse(result, result.message)
      );
    } catch (error) {
      console.error('Cancel appointment error:', error);
      res.status(400).json(
        formatter.errorResponse(error.message, 400)
      );
    }
  }

  /**
   * Reschedule appointment
   * POST /api/appointments/:id/reschedule
   */
  async rescheduleAppointment(req, res) {
    try {
      const { id } = req.params;
      const { newDate } = req.body;

      if (!newDate) {
        return res.status(400).json(
          formatter.errorResponse('New date is required', 400)
        );
      }

      const result = await schedulingService.rescheduleAppointment(id, newDate);

      res.json(
        formatter.successResponse(result, result.message)
      );
    } catch (error) {
      console.error('Reschedule appointment error:', error);
      res.status(400).json(
        formatter.errorResponse(error.message, 400)
      );
    }
  }

  /**
   * Confirm appointment
   * POST /api/appointments/:id/confirm
   */
  async confirmAppointment(req, res) {
    try {
      const { id } = req.params;
      const result = await schedulingService.confirmAppointment(id);

      res.json(
        formatter.successResponse(result, result.message)
      );
    } catch (error) {
      console.error('Confirm appointment error:', error);
      res.status(400).json(
        formatter.errorResponse(error.message, 400)
      );
    }
  }

  /**
   * Schedule follow-up
   * POST /api/appointments/:id/follow-up
   */
  async scheduleFollowUp(req, res) {
    try {
      const { id } = req.params;
      const { daysAfter } = req.body;

      const result = await followUpService.scheduleFollowUp(id, daysAfter);

      res.status(201).json(
        formatter.successResponse(result, result.message)
      );
    } catch (error) {
      console.error('Schedule follow-up error:', error);
      res.status(400).json(
        formatter.errorResponse(error.message, 400)
      );
    }
  }
}

module.exports = new AppointmentController();
