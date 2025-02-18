import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
} from "../controllers/room.js";
import { checkRoomAvailability } from "../controllers/room.js";
import { updateRoomPrice } from "../controllers/room.js";  
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();
//CREATE
router.post("/:hotelid", verifyAdmin, createRoom);

//UPDATE
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id", verifyAdmin, updateRoom);
//DELETE
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);
//GET

router.get("/:id", getRoom);
//GET ALL

router.get("/", getRooms);

//patch request to update the price of a room
router.patch("/:id/price", updateRoomPrice);

// HEAD request to check if a room is available for specific dates
router.head("/:id/availability", checkRoomAvailability);

export default router;