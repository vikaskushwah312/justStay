import express from "express";
import {
  createRoom,
  updateRoom,
  getAllRooms,
  getRoomById,
  deleteRoom,
} from "../controllers/propertyRoom.controller.js";

const router = express.Router();

router.post("/", createRoom);        // Create
router.put("/:id", updateRoom);      // Update
router.get("/", getAllRooms);        // Get all
router.get("/:id", getRoomById);     // Get by ID
router.delete("/:id", deleteRoom);   // Delete

export default router;
