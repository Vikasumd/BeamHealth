import express from "express";
import cors from "cors";

import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import insuranceRoutes from "./routes/insuranceRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Attach routes
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/insurances", insuranceRoutes);
app.use("/workflow", workflowRoutes);
app.use("/invoices", invoiceRoutes);

export default app;
