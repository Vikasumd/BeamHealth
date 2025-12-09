import insuranceRepository from "../repositories/insuranceRepository.js";

export default {
  async getRoutingOptions(insuranceId) {
    const all = await insuranceRepository.getAll();
    const current = all.find(i => i.id === Number(insuranceId));

    if (!current || current.eligible) return null;

    return {
      message: "Insurance denied. Here are possible alternatives:",
      alternativePlans: all.filter(i => i.payer === current.payer && i.eligible),
      selfPayEstimate: 120,  // static for now
      denialExplanation: current.reason
    };
  }
};
