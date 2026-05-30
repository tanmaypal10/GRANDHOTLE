"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Stat_1 = __importDefault(require("../models/Stat"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/stats
// @desc    Get all stats (Public)
router.get("/", async (_req, res) => {
    try {
        const list = await Stat_1.default.find();
        return res.json(list);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error fetching stats", error });
    }
});
// @route   PUT /api/stats/:id
// @desc    Update a stat (Admin/Staff only)
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)(["admin", "staff"]), async (req, res) => {
    const { number, suffix, label } = req.body;
    try {
        const updateData = {};
        if (number !== undefined)
            updateData.number = number;
        if (suffix !== undefined)
            updateData.suffix = suffix;
        if (label !== undefined)
            updateData.label = label;
        const updated = await Stat_1.default.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ message: "Stat not found" });
        }
        return res.json(updated);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error updating stat", error });
    }
});
exports.default = router;
