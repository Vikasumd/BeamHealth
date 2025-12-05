import intakeService from "../services/intakeService.js";
import eligibilityService from "../services/eligibilityService.js";
import routingService from "../services/routingService.js";
import schedulingService from "../services/schedulingService.js";
import followUpService from "../services/followUpService.js";

import patientRepository from "../repositories/patientRepository.js";

export default {
  async runUnifiedFlow(req, res) {
    try {
      const { patientId, insuranceId } = req.body;

      const patient = await patientRepository.getById(patientId);

      // 1. Auto-fill intake
      const intake = await intakeService.autoFillIntake(patientId);

      // 2. Eligibility
      const eligibility = await eligibilityService.checkEligibility(insuranceId);

      // 3. Smart routing for denial
      let routing = null;
      if (eligibility && !eligibility.eligible) {
        routing = await routingService.getRoutingOptions(insuranceId);
      }

      // 4. Get available slots
      const slots = await schedulingService.getAvailableSlots();

      return res.json({
        intake,
        eligibility,
        routing,
        availableSlots: slots
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Workflow failed" });
    }
  },

  async bookAndFollowUp(req, res) {
    try {
      const { appointmentId, patientId, insuranceId } = req.body;

      const slot = await schedulingService.bookSlot(appointmentId, patientId);
      const patient = await patientRepository.getById(patientId);
      const eligibility = await eligibilityService.checkEligibility(insuranceId);

      const followUp = await followUpService.generateFollowUp(
        patient,
        slot,
        eligibility
      );

      res.json({
        bookedSlot: slot,
        followUp
      });

    } catch (err) {
      res.status(500).json({ error: "Booking workflow failed" });
    }
  }
};
