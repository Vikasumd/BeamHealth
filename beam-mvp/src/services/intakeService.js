import patientRepository from "../repositories/patientRepository.js";

export default {
  async autoFillIntake(patientId) {
    const patient = await patientRepository.getById(patientId);

    if (!patient) return null;

    return {
      name: `${patient.first_name} ${patient.last_name}`,
      dob: patient.dob,
      email: patient.email,
      phone: patient.phone,
      gender: patient.gender
    };
  }
};
