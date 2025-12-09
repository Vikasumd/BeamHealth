import express from "express";
import workflowController from "../controllers/workflowController.js";

const router = express.Router();

router.post("/run", workflowController.runUnifiedFlow);
router.post("/book", workflowController.bookAndFollowUp);

export default router;
