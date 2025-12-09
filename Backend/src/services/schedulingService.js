import appointmentRepository from "../repositories/appointmentRepository.js";

export default {
  async getAvailableSlots() {
    return await appointmentRepository.getAvailable();
  },

  async bookSlot(appointmentId, patientId) {
    return await appointmentRepository.bookAppointment(appointmentId, patientId);
  }
};
