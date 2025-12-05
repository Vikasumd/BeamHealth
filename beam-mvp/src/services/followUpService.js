export default {
  async generateFollowUp(patient, appointment, eligibility) {
    return {
      confirmation: `Appointment confirmed for ${patient.first_name} at ${appointment.start}`,
      eligibilitySummary: eligibility,
      reminder: "Reminder scheduled 24 hours before visit.",
      postVisitTask: "Follow-up form will be auto-generated."
    };
  }
};
