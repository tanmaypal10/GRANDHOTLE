import { Router, Response } from "express";
import Booking from "../models/Booking";
import Room from "../models/Room";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

// @route   POST /api/bookings
// @desc    Create a new booking (Authenticated users)
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { roomId, checkIn, checkOut, guests, roomsCount } = req.body;

  try {
    if (!roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: "Please enter all required booking fields" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.available) {
      return res.status(400).json({ message: "Selected room is not available" });
    }

    // Calculate total price: (number of nights) * room.price * roomsCount
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    const totalPrice = nights * room.price * (roomsCount || 1);

    const newBooking = new Booking({
      user: req.user?.id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      roomsCount: roomsCount || 1,
      totalPrice,
      status: "pending",
    });

    const savedBooking = await newBooking.save();
    const populated = await Booking.findById(savedBooking._id)
      .populate("room")
      .populate("user", "name email");

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Server error creating booking", error });
  }
});

// @route   GET /api/bookings/my
// @desc    Get current user's bookings (Authenticated users)
router.get("/my", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ user: req.user?.id })
      .populate("room")
      .sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching user bookings", error });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings (Admin/Staff only)
router.get("/", authenticate, requireRole(["admin", "staff"]), async (_req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate("room")
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching all bookings", error });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status (Admin/Staff only)
router.put("/:id", authenticate, requireRole(["admin", "staff"]), async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  try {
    if (!status || !["pending", "approved", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("room")
      .populate("user", "name email");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json(updatedBooking);
  } catch (error) {
    return res.status(500).json({ message: "Server error updating booking", error });
  }
});

export default router;
