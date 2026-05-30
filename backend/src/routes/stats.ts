import { Router, Response } from "express";
import Stat from "../models/Stat";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

// @route   GET /api/stats
// @desc    Get all stats (Public)
router.get("/", async (_req: any, res: Response) => {
  try {
    const list = await Stat.find();
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching stats", error });
  }
});

// @route   PUT /api/stats/:id
// @desc    Update a stat (Admin/Staff only)
router.put("/:id", authenticate, requireRole(["admin", "staff"]), async (req: any, res: Response) => {
  const { number, suffix, label } = req.body;

  try {
    const updateData: any = {};
    if (number !== undefined) updateData.number = number;
    if (suffix !== undefined) updateData.suffix = suffix;
    if (label !== undefined) updateData.label = label;

    const updated = await Stat.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Stat not found" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Server error updating stat", error });
  }
});

export default router;
