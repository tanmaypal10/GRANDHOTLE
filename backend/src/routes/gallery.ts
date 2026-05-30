import { Router, Response } from "express";
import GalleryItem from "../models/GalleryItem";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

// @route   GET /api/gallery
// @desc    Get all gallery items (Public)
router.get("/", async (_req: any, res: Response) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching gallery", error });
  }
});

// @route   POST /api/gallery
// @desc    Add a gallery item (Admin/Staff only)
router.post("/", authenticate, requireRole(["admin", "staff"]), async (req: any, res: Response) => {
  const { src, alt, span } = req.body;

  try {
    if (!src || !alt) {
      return res.status(400).json({ message: "Please provide image source URL/base64 and alt text" });
    }

    const newItem = new GalleryItem({
      src,
      alt,
      span: span || "",
    });

    const saved = await newItem.save();
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ message: "Server error adding gallery item", error });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete a gallery item (Admin/Staff only)
router.delete("/:id", authenticate, requireRole(["admin", "staff"]), async (req: any, res: Response) => {
  try {
    const deleted = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Gallery item not found" });
    }
    return res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting gallery item", error });
  }
});

export default router;
