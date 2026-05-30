import { Router, Response } from "express";
import Room from "../models/Room";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

// @route   GET /api/rooms
// @desc    Get all rooms (available or all, depending on query)
router.get("/", async (req: any, res: Response) => {
  try {
    const filter: any = {};
    if (req.query.available === "true") {
      filter.available = true;
    }
    const rooms = await Room.find(filter).sort({ createdAt: -1 });
    return res.json(rooms);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching rooms", error });
  }
});

// @route   GET /api/rooms/:id
// @desc    Get details of a single room
router.get("/:id", async (req: any, res: Response) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    return res.json(room);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching room details", error });
  }
});

// @route   POST /api/rooms
// @desc    Create a new room (Admin/Staff only)
router.post("/", authenticate, requireRole(["admin", "staff"]), async (req: any, res: Response) => {
  const { name, price, image, rating, amenities, desc, available } = req.body;

  try {
    if (!name || !price || !image || !desc) {
      return res.status(400).json({ message: "Please provide name, price, image and description" });
    }

    const newRoom = new Room({
      name,
      price,
      image,
      rating: rating || 5.0,
      amenities: amenities || [],
      desc,
      available: available !== undefined ? available : true,
    });

    const savedRoom = await newRoom.save();
    return res.status(201).json(savedRoom);
  } catch (error) {
    return res.status(500).json({ message: "Server error creating room", error });
  }
});

// @route   PUT /api/rooms/:id
// @desc    Update a room (Admin/Staff only)
router.put("/:id", authenticate, requireRole(["admin", "staff"]), async (req: any, res: Response) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.json(updatedRoom);
  } catch (error) {
    return res.status(500).json({ message: "Server error updating room", error });
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete a room (Admin/Staff only)
router.delete("/:id", authenticate, requireRole(["admin", "staff"]), async (req: any, res: Response) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    return res.json({ message: "Room deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting room", error });
  }
});

export default router;
