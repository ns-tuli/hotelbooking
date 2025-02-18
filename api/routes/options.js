import express from "express";
import { optionsHandler } from "../controllers/options.js";

const router = express.Router();

router.options("/resource", optionsHandler);

export default router;
