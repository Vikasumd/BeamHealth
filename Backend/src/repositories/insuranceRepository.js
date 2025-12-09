import { readJSON } from "../utils/fileUtil.js";

export default {
  async getById(id) {
    const insurances = await readJSON("insurances.json");
    return insurances.find(i => i.id === Number(id));
  },

  async getAll() {
    return await readJSON("insurances.json");
  }
};
