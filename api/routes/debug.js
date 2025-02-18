import express from "express";
import { traceRequest } from "../controllers/debug.js";

const router = express.Router();

router.trace("/debug", traceRequest);

export default router;
