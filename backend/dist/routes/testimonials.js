"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Testimonial_1 = __importDefault(require("../models/Testimonial"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/testimonials
// @desc    Get all testimonials (Public)
router.get("/", async (_req, res) => {
    try {
        const list = await Testimonial_1.default.find().sort({ createdAt: -1 });
        return res.json(list);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error fetching testimonials", error });
    }
});
// @route   POST /api/testimonials
// @desc    Add a testimonial (Public or Authenticated guests, or Admin/Staff)
// Let's allow authenticated guests or admin to add testimonials
router.post("/", auth_1.authenticate, async (req, res) => {
    const { name, role, text, rating } = req.body;
    try {
        if (!name || !role || !text) {
            return res.status(400).json({ message: "Please fill in name, role, and text" });
        }
        const newTestimonial = new Testimonial_1.default({
            name,
            role,
            text,
            rating: rating || 5,
        });
        const saved = await newTestimonial.save();
        return res.status(201).json(saved);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error adding testimonial", error });
    }
});
// @route   DELETE /api/testimonials/:id
// @desc    Delete a testimonial (Admin/Staff only)
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)(["admin", "staff"]), async (req, res) => {
    try {
        const deleted = await Testimonial_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Testimonial not found" });
        }
        return res.json({ message: "Testimonial deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error deleting testimonial", error });
    }
});
exports.default = router;
