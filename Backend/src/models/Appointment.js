export default class Appointment {
  constructor({ id, status, start, slot_duration, patient_id }) {
    this.id = id;
    this.status = status;
    this.start = start;
    this.slot_duration = slot_duration;
    this.patient_id = patient_id;
  }
}
