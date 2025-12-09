import express from "express";
import appointmentRepository from "../repositories/appointmentRepository.js";

const router = express.Router();

router.get("/available", async (req, res) => {
  res.json(await appointmentRepository.getAvailable());
});

export default router;
