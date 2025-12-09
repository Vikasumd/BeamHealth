export default class Patient {
  constructor({ id, first_name, last_name, dob, email, phone, gender }) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.dob = dob;
    this.email = email;
    this.phone = phone;
    this.gender = gender;
  }
}
