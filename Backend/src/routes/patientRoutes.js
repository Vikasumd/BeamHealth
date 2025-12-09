import express from "express";
import { readJSON, writeJSON } from "../utils/fileUtil.js";

const router = express.Router();

// Get all patients
router.get("/", async (req, res) => {
  const patients = await readJSON("patients.json");
  res.json(patients);
});

// Get patient by ID
router.get("/:id", async (req, res) => {
  const patients = await readJSON("patients.json");
  const patient = patients.find(p => p.id === Number(req.params.id));
  res.json(patient || null);
});

// Create new patient
router.post("/", async (req, res) => {
  try {
    const patients = await readJSON("patients.json");
    
    // Generate new ID (max ID + 1)
    const maxId = patients.reduce((max, p) => Math.max(max, p.id), 0);
    const newId = maxId + 1;
    
    const newPatient = {
      id: newId,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      dob: req.body.dob,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender
    };
    
    patients.push(newPatient);
    await writeJSON("patients.json", patients);
    
    res.status(201).json(newPatient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create patient" });
  }
});

export default router;
