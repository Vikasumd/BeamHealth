import { readJSON, writeJSON } from "../utils/fileUtil.js";

export default {
  async getAvailable() {
    const appointments = await readJSON("appointments.json");
    return appointments.filter(a => a.status === "available");
  },

  async bookAppointment(id, patientId) {
    const appointments = await readJSON("appointments.json");

    const target = appointments.find(a => a.id === Number(id));
    if (!target) return null;

    target.status = "booked";
    target.patient_id = patientId;

    await writeJSON("appointments.json", appointments);
    return target;
  }
};
