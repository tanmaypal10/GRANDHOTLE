"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GalleryItem_1 = __importDefault(require("../models/GalleryItem"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/gallery
// @desc    Get all gallery items (Public)
router.get("/", async (_req, res) => {
    try {
        const items = await GalleryItem_1.default.find().sort({ createdAt: -1 });
        return res.json(items);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error fetching gallery", error });
    }
});
// @route   POST /api/gallery
// @desc    Add a gallery item (Admin/Staff only)
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)(["admin", "staff"]), async (req, res) => {
    const { src, alt, span } = req.body;
    try {
        if (!src || !alt) {
            return res.status(400).json({ message: "Please provide image source URL/base64 and alt text" });
        }
        const newItem = new GalleryItem_1.default({
            src,
            alt,
            span: span || "",
        });
        const saved = await newItem.save();
        return res.status(201).json(saved);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error adding gallery item", error });
    }
});
// @route   DELETE /api/gallery/:id
// @desc    Delete a gallery item (Admin/Staff only)
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)(["admin", "staff"]), async (req, res) => {
    try {
        const deleted = await GalleryItem_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Gallery item not found" });
        }
        return res.json({ message: "Gallery item deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error deleting gallery item", error });
    }
});
exports.default = router;
