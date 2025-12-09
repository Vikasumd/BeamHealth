import patientRepository from "../repositories/patientRepository.js";

export default {
  async generateFollowUp(patient, appointment, eligibility) {
    // Format date nicely
    const appointmentDate = new Date(appointment.start);
    const dateOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const timeOptions = { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    };
    
    const formattedDate = appointmentDate.toLocaleDateString('en-US', dateOptions);
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', timeOptions);
    
    return {
      // Appointment Confirmation
      confirmation: {
        patientName: `${patient.first_name} ${patient.last_name}`,
        date: formattedDate,
        time: formattedTime,
        duration: appointment.slot_duration,
        appointmentId: appointment.id,
        message: "All details have been added to the patient chart, and the front desk has been notified."
      },
      
      // Eligibility Summary
      eligibilitySummary: {
        status: eligibility?.eligible ? "Eligible" : "Not Eligible",
        isEligible: eligibility?.eligible || false,
        copay: eligibility?.coPay || null,
        reason: eligibility?.reason || null,
        notes: eligibility?.eligible 
          ? "No additional issues reported" 
          : eligibility?.reason || "Coverage issue detected"
      },
      
      // Reminder Info
      reminder: {
        timing: "24 hours before appointment",
        includes: [
          "Date & time",
          "Location / instructions", 
          "Copay information",
          "Pre-visit checklist (if needed)"
        ],
        message: "We'll send a reminder message to the patient automatically."
      },
      
      // Post-Visit Workflow
      postVisit: {
        automatedTasks: [
          "Generate a follow-up form",
          "Tag the visit as pending documentation",
          "Prepare the billing draft based on eligibility and visit type",
          "Notify staff if any action is required"
        ],
        message: "Everything flows straight into the EMR — no retyping, no extra clicks."
      }
    };
  }
};
