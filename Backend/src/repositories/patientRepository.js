import { readJSON } from "../utils/fileUtil.js";

export default {
  async getAll() {
    return await readJSON("patients.json");
  },

  async getById(id) {
    const patients = await readJSON("patients.json");
    return patients.find(p => p.id === Number(id));
  }
};
