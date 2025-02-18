import express from "express";
import { generateSalesReport } from "../controllers/report.js";  // Import the report controller

const router = express.Router();

// Route to generate monthly or yearly sales report
router.get("/generate", generateSalesReport);

export default router;
