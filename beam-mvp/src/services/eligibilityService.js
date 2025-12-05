import insuranceRepository from "../repositories/insuranceRepository.js";

export default {
  async checkEligibility(insuranceId) {
    const insurance = await insuranceRepository.getById(insuranceId);

    if (!insurance) return null;

    return {
      eligible: insurance.eligible,
      coPay: insurance.coPay ?? null,
      reason: insurance.reason ?? null
    };
  }
};
