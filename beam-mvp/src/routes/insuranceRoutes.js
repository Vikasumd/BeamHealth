import express from "express";
import insuranceRepository from "../repositories/insuranceRepository.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await insuranceRepository.getAll());
});

router.get("/:id", async (req, res) => {
  res.json(await insuranceRepository.getById(req.params.id));
});

export default router;
