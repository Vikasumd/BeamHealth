import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? "https://beamhealth.onrender.com" 
    : "http://localhost:4000"
});

export default api;
