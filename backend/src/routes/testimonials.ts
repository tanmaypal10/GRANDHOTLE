import { Router, Response } from "express";
import Testimonial from "../models/Testimonial";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

// @route   GET /api/testimonials
// @desc    Get all testimonials (Public)
router.get("/", async (_req: any, res: Response) => {
  try {
    const list = await Testimonial.find().sort({ createdAt: -1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching testimonials", error });
  }
});

// @route   POST /api/testimonials
// @desc    Add a testimonial (Public or Authenticated guests, or Admin/Staff)
// Let's allow authenticated guests or admin to add testimonials
router.post("/", authenticate, async (req: any, res: Response) => {
  const { name, role, text, rating } = req.body;

  try {
    if (!name || !role || !text) {
      return res.status(400).json({ message: "Please fill in name, role, and text" });
    }

    const newTestimonial = new Testimonial({
      name,
      role,
      text,
      rating: rating || 5,
    });

    const saved = await newTestimonial.save();
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ message: "Server error adding testimonial", error });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete a testimonial (Admin/Staff only)
router.delete("/:id", authenticate, requireRole(["admin", "staff"]), async (req: any, res: Response) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    return res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting testimonial", error });
  }
});

export default router;
